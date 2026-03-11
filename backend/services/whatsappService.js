const { Client, LocalAuth, Buttons } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const db = require('../config/db'); // Asumiendo que podemos consultar la DB aquí

// Mapa para guardar los diferentes clientes (uno por sucursal)
const clientsMap = new Map();

/**
 * Inicializar todos los clientes de WhatsApp (uno por cada sucursal activa en DB)
 */
const inicializarClientesMultiples = async () => {
    try {
        // Consultar todas las sucursales
        const [sucursales] = await db.query('SELECT id, nombre, telefono FROM sucursales');
        
        console.log(`\n=== INICIANDO ${sucursales.length} SESIONES DE WHATSAPP (MULTI-CLIENT) ===`);

        for (const sucursal of sucursales) {
            const { id: sucursal_id, nombre } = sucursal;
            
            console.log(`\n⏳ Configurando cliente para Sucursal: ${nombre} (ID: ${sucursal_id})...`);

            // Inicializar un cliente específico para esta sucursal
            const client = new Client({
                // Configurar LocalAuth indicando un clientId único por sucursal
                authStrategy: new LocalAuth({ clientId: `sucursal_${sucursal_id}` }),
                puppeteer: {
                    // Argumentos óptimos para rendimiento / baja memoria ("Web Quality Skill")
                    args: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--disable-dev-shm-usage',
                        '--disable-accelerated-2d-canvas',
                        '--no-first-run',
                        '--no-zygote',
                        '--single-process', 
                        '--disable-gpu'
                    ]
                }
            });

            // Generar código QR en la terminal, indicando de qué sucursal es
            client.on('qr', (qr) => {
                console.log(`\n--- ESCANEA ESTE QR PARA LA SUCURSAL: ${nombre} ---`);
                qrcode.generate(qr, { small: true });
            });

            // Evento cuando el cliente está listo
            client.on('ready', () => {
                console.log(`✅ Cliente de WhatsApp Web LISTO para Sucursal: ${nombre} (ID: ${sucursal_id})`);
            });

            // Escuchar mensajes entrantes (y los enviados por uno mismo) específicos de este cliente
            client.on('message_create', async (msg) => {
                const comando = msg.body.toLowerCase().trim();

                if (comando.startsWith('!citas')) {
                    try {
                        let query = '';
                        let params = [];
                        let tituloMensaje = '';

                        const hoyDate = new Date();
                        const hoy = hoyDate.toISOString().split('T')[0];

                        if (comando === '!citas hoy') {
                            query = `
                                SELECT c.id AS cita_id, c.cliente_nombre, c.telefono, c.motivo, 
                                       DATE_FORMAT(c.fecha_hora, '%d/%m/%Y a las %H:%i hrs') AS fecha_formateada, 
                                       s.nombre AS sucursal_nombre 
                                FROM citas c
                                JOIN sucursales s ON c.sucursal_id = s.id
                                WHERE c.sucursal_id = ? 
                                AND DATE(c.fecha_hora) = ? 
                                AND c.estado != 'Cancelada'
                                ORDER BY c.fecha_hora ASC
                            `;
                            params = [sucursal_id, hoy];
                            tituloMensaje = `🤖 *Citas de hoy en ${nombre}:* 📅`;
                        } else if (comando === '!citas mañana') {
                            const mananaDate = new Date(hoyDate);
                            mananaDate.setDate(hoyDate.getDate() + 1);
                            const manana = mananaDate.toISOString().split('T')[0];
                            
                            query = `
                                SELECT c.id AS cita_id, c.cliente_nombre, c.telefono, c.motivo, 
                                       DATE_FORMAT(c.fecha_hora, '%d/%m/%Y a las %H:%i hrs') AS fecha_formateada, 
                                       s.nombre AS sucursal_nombre 
                                FROM citas c
                                JOIN sucursales s ON c.sucursal_id = s.id
                                WHERE c.sucursal_id = ? 
                                AND DATE(c.fecha_hora) = ? 
                                AND c.estado != 'Cancelada'
                                ORDER BY c.fecha_hora ASC
                            `;
                            params = [sucursal_id, manana];
                            tituloMensaje = `🤖 *Citas de mañana en ${nombre}:* 📅`;
                        } else if (comando === '!citas semana') {
                            const mananaDate = new Date(hoyDate);
                            mananaDate.setDate(hoyDate.getDate() + 1);
                            const manana = mananaDate.toISOString().split('T')[0];
                            
                            const proxSemanaDate = new Date(mananaDate);
                            proxSemanaDate.setDate(mananaDate.getDate() + 7);
                            const proxSemana = proxSemanaDate.toISOString().split('T')[0];
                            
                            query = `
                                SELECT c.id AS cita_id, c.cliente_nombre, c.telefono, c.motivo, 
                                       DATE_FORMAT(c.fecha_hora, '%d/%m/%Y a las %H:%i hrs') AS fecha_formateada, 
                                       s.nombre AS sucursal_nombre 
                                FROM citas c
                                JOIN sucursales s ON c.sucursal_id = s.id
                                WHERE c.sucursal_id = ? 
                                AND DATE(c.fecha_hora) BETWEEN ? AND ? 
                                AND c.estado != 'Cancelada'
                                ORDER BY c.fecha_hora ASC
                            `;
                            params = [sucursal_id, manana, proxSemana];
                            tituloMensaje = `🤖 *Citas de la semana en ${nombre}:* 📅`;
                        } else if (comando === '!citas todas') {
                            query = `
                                SELECT c.id AS cita_id, c.cliente_nombre, c.telefono, c.motivo, 
                                       DATE_FORMAT(c.fecha_hora, '%d/%m/%Y a las %H:%i hrs') AS fecha_formateada, 
                                       s.nombre AS sucursal_nombre 
                                FROM citas c
                                JOIN sucursales s ON c.sucursal_id = s.id
                                WHERE c.sucursal_id = ? 
                                AND DATE(c.fecha_hora) >= ? 
                                AND c.estado != 'Cancelada'
                                ORDER BY c.fecha_hora ASC
                            `;
                            params = [sucursal_id, hoy];
                            tituloMensaje = `🤖 *Todas las próximas citas en ${nombre}:* 📅`;
                        } else if (comando.startsWith('!confirmar ')) {
                            const idCita = comando.replace('!confirmar ', '').trim();
                            if (!idCita || isNaN(idCita)) {
                                return await msg.reply('❌ Formato incorrecto. Usa: !confirmar [ID]\nEjemplo: !confirmar 5');
                            }
                            const [updateResult] = await db.query(
                                'UPDATE citas SET estado = "Confirmada" WHERE id = ? AND sucursal_id = ?', 
                                [idCita, sucursal_id]
                            );
                            if (updateResult.affectedRows === 0) {
                                return await msg.reply(`⚠️ No se encontró la cita ID ${idCita} en esta sucursal.`);
                            }
                            return await msg.reply(`✅ *Cita ID ${idCita}* ha sido CONFIRMADA exitosamente en el sistema.`);
                        } else if (comando.startsWith('!cancelar ')) {
                            const idCita = comando.replace('!cancelar ', '').trim();
                            if (!idCita || isNaN(idCita)) {
                                return await msg.reply('❌ Formato incorrecto. Usa: !cancelar [ID]\nEjemplo: !cancelar 5');
                            }
                            const [updateResult] = await db.query(
                                'UPDATE citas SET estado = "Cancelada" WHERE id = ? AND sucursal_id = ?', 
                                [idCita, sucursal_id]
                            );
                            if (updateResult.affectedRows === 0) {
                                return await msg.reply(`⚠️ No se encontró la cita ID ${idCita} en esta sucursal.`);
                            }
                            return await msg.reply(`🚫 *Cita ID ${idCita}* ha sido CANCELADA exitosamente en el sistema.`);
                        } else {
                            return; // Comando no reconocido (!citas asdasd)
                        }

                        const [citasResult] = await db.query(query, params);

                        if (citasResult.length === 0) {
                            let msgVacio = `No hay citas agendadas para ${comando.replace('!citas ', '')}.`;
                            if (comando === '!citas todas') msgVacio = 'No hay citas futuras en el sistema.';
                            await msg.reply(`🤖 *${nombre}*\n${msgVacio}`);
                        } else {
                            let respuesta = `${tituloMensaje}\n\n`;
                            citasResult.forEach((cita) => {
                                const phoneNum = cita.telefono ? `+${String(cita.telefono).replace(/\+/g, '')}` : 'No registrado';
                                respuesta += `*[${cita.cita_id}]* ${cita.fecha_formateada}\n`;
                                respuesta += `👤 *Cliente:* ${cita.cliente_nombre}\n`;
                                respuesta += `📞 *Teléfono:* ${phoneNum}\n`;
                                respuesta += `🏥 *Sucursal:* ${cita.sucursal_nombre}\n`;
                                respuesta += `👁️ *Motivo:* ${cita.motivo}\n`;
                                respuesta += `------------------------\n`;
                            });

                            // Si solo hay una cita, enviamos botones interactivos directamente
                            if (citasResult.length === 1) {
                                const btnRef = new Buttons(respuesta, [
                                    { body: `!confirmar ${citasResult[0].cita_id}` },
                                    { body: `!cancelar ${citasResult[0].cita_id}` }
                                ], 'Opción Rápida', 'Confirma o cancela esta cita:');
                                await msg.reply(btnRef);
                            } else {
                                // WhatsApp-web.js tiene limitaciones en la cantidad de botones (máximo 3).
                                // Si hay múltiples citas, lo enviamos como texto con instrucciones al final para usar los comandos manuales.
                                respuesta += `\nPara gestionar citas escribe:\n*!confirmar [ID]* o *!cancelar [ID]*`;
                                await msg.reply(respuesta);
                            }
                        }
                    } catch (error) {
                        console.error(`Error al procesar el comando ${comando} en sucursal ${nombre}:`, error);
                        await msg.reply('❌ Ocurrió un error al consultar las citas en la base de datos.');
                    }
                }
            });

            // Guardar el cliente en el Map
            clientsMap.set(sucursal_id, client);

            // Inicializar este cliente
            client.initialize().catch(err => {
                console.error(`\n❌ Error crítico al inicializar cliente WhatsApp para ${nombre} (ID: ${sucursal_id}):`, err);
            });
            
            // Pausa pequeña entre inicializaciones para no saturar CPU en el arranque inicial
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
    } catch (error) {
        console.error('Error al inicializar la base de datos de sucursales para WhatsApp:', error);
    }
};

// Iniciar de forma desacoplada
inicializarClientesMultiples();

/**
 * Enviar un mensaje de WhatsApp desde un número de sucursal a un destinatario
 * @param {number} sucursal_id - ID de la sucursal desde donde se enviará el mensaje
 * @param {string} destinatario - Número con código de país (ej: '56912345678')
 * @param {string} texto - El contenido del mensaje
 */
const enviarMensaje = async (sucursal_id, destinatario, texto) => {
    try {
        const client = clientsMap.get(Number(sucursal_id));
        
        if (!client) {
            console.warn(`⚠️ No se encontró cliente de WhatsApp activo para la sucursal_id: ${sucursal_id}. No se envió el mensaje a ${destinatario}.`);
            return null; // Resolvemos suave para no romper el flujo
        }

        let numeroLimpio = destinatario.replace('+', '').replace(/\s+/g, '');
        const chatId = numeroLimpio.includes('@c.us') ? numeroLimpio : `${numeroLimpio}@c.us`;

        const respuesta = await client.sendMessage(chatId, texto);
        console.log(`✅ Notificación enviada a ${destinatario} desde sucursal_id: ${sucursal_id}`);
        return respuesta;
    } catch (error) {
        if (error.message && error.message.includes('No LID for user')) {
            console.warn(`⚠️ Aviso: El número ${destinatario} no parece estar registrado en WhatsApp ('No LID for user').`);
            return null; // Evita que se detenga la ejecución
        }
        console.error(`❌ Error al enviar mensaje desde sucursal_id ${sucursal_id} a ${destinatario}:`, error);
        throw error;
    }
};

/**
 * Cerrar sesión de WhatsApp para una sucursal específica (Forzar nuevo QR)
 * Esto desvincula el dispositivo y borra la carpeta de sesión local.
 * @param {number} sucursal_id 
 */
const cerrarSesion = async (sucursal_id) => {
    try {
        const idNum = Number(sucursal_id);
        const client = clientsMap.get(idNum);

        if (!client) {
            throw new Error(`El cliente para la sucursal ${idNum} no está inicializado o no existe.`);
        }

        console.log(`\n🔴 Cerrando y limpiando sesión de WhatsApp para Sucursal ID: ${idNum}...`);
        
        // El logout desvincula el teléfono y borra la carpeta .wwebjs_auth/session_X
        await client.logout();
        
        // Destruir la instancia de Puppeteer actual para liberar RAM
        await client.destroy();

        console.log(`✅ Sesión eliminada. Reiniciando cliente para generar QR nuevo...`);
        
        // Volver a inicializarlo forzará que emita el evento 'qr' de nuevo!
        client.initialize();
        
        return { mensaje: `Sesión de sucursal ${idNum} cerrada y reiniciando QR en consola.` };

    } catch (error) {
        console.error(`Error al cerrar sesión de sucursal ${sucursal_id}:`, error);
        throw error;
    }
};

module.exports = {
    clientsMap,
    enviarMensaje,
    cerrarSesion
};
