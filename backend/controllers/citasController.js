// backend/controllers/citasController.js
const db = require('../config/db');
const { enviarCorreoConfirmacion, enviarAlertaAdmin } = require('../config/mailer');
const { enviarMensaje, cerrarSesion } = require('../services/whatsappService');
const { crearEventoCalendario } = require('../services/calendarService');

// Función 1: Guardar una cita nueva y enviar el correo
const crearCita = async (req, res) => {
    try {
        const { sucursal_id, cliente_nombre, rut, telefono, email, fecha_hora, motivo } = req.body;
        
        if (!sucursal_id || !cliente_nombre || !rut || !fecha_hora) {
            return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
        }

        // Motivos permitidos según reglas de negocio del cliente
        const motivosPermitidos = ['Revisión oftalmológica', 'Despacho de receta médica'];
        const motivoReal = motivo && motivosPermitidos.includes(motivo) ? motivo : 'Revisión oftalmológica';

        // Validación de bloque ocupado para Revisión oftalmológica
        if (motivoReal === 'Revisión oftalmológica') {
            const checkQuery = `
                SELECT id FROM citas 
                WHERE sucursal_id = ? 
                  AND fecha_hora = ? 
                  AND motivo = 'Revisión oftalmológica' 
                  AND estado != 'Cancelada'
            `;
            const [existentes] = await db.query(checkQuery, [sucursal_id, fecha_hora]);
            
            if (existentes && existentes.length > 0) {
                return res.status(400).json({ 
                    mensaje: 'Ese horario ya está reservado para una Revisión oftalmológica en esta sucursal. Por favor, intenta con otra hora.' 
                });
            }
        }

        const query = `INSERT INTO citas (sucursal_id, cliente_nombre, rut, telefono, email, fecha_hora, motivo) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const valores = [sucursal_id, cliente_nombre, rut, telefono, email, fecha_hora, motivoReal];
        
        const [resultado] = await db.query(query, valores);

        // Obtener el nombre de la sucursal
        const [sucursalResult] = await db.query('SELECT nombre FROM sucursales WHERE id = ?', [sucursal_id]);
        const nombreSucursal = sucursalResult.length > 0 ? sucursalResult[0].nombre : `Sucursal ${sucursal_id}`;

        // Formatear la fecha
        let fechaFormateada = fecha_hora;
        if (fecha_hora.includes('T')) {
            const [fechaPart, horaPart] = fecha_hora.split('T');
            const [year, month, day] = fechaPart.split('-');
            fechaFormateada = `${day}/${month}/${year} a las ${horaPart} hrs`;
        }

        // Preparar notificación por WhatsApp
        // Asumiendo que el admin tiene un número configurado en .env
        const adminPhone = process.env.ADMIN_PHONE || '56975879294';
        const msgAdmin = `*Nueva cita agendada*\nCliente: ${cliente_nombre}\n📞 Celular: ${telefono}\nMotivo: ${motivoReal}\nFecha: ${fechaFormateada}\nSucursal: ${nombreSucursal}`;

        // Mapeo de ubicaciones para generar enlaces de mapas
        const locationMap = {
            1: { // Viña del Mar
                direccion: "Av. Valparaíso 518 local 2 galería rapallo, Viña del Mar",
                mapQuery: "Av.+Valparaíso+518,+Viña+del+Mar,+Valparaíso,+Chile"
            },
            2: { // Quilpué
                direccion: "Calle Blanco 992-B, Quilpué",
                mapQuery: "Blanco+Encalada+992,+Quilpué,+Valparaíso,+Chile"
            },
            3: { // La Calera
                direccion: "Calle carrera 988 esq. Huici, La Calera",
                mapQuery: "Carrera+988,+La+Calera,+Valparaíso,+Chile"
            }
        };

        const loc = locationMap[sucursal_id] || locationMap[1];
        const gmapsLink = `https://www.google.com/maps/search/?api=1&query=${loc.mapQuery}`;
        const wazeLink = `https://waze.com/ul?q=${loc.mapQuery}`;

        // Preparar notificación por WhatsApp para el Cliente
        const msgCliente = `¡Hola ${cliente_nombre.split(' ')[0]}! 🌟\n\nTu reserva en *Ópticas Blanco* ha sido ingresada correctamente y el equipo ya está notificado.\n\n🏥 *Sucursal:* ${nombreSucursal}\n📍 *Dirección:* ${loc.direccion}\n📅 *Fecha y Hora:* ${fechaFormateada}\n👁️ *Motivo:* ${motivoReal}\n\n🗺️ *¿Cómo llegar?*\n• Google Maps:\n${gmapsLink}\n\n• Waze:\n${wazeLink}\n\n¡Nos vemos pronto!`;

        const citaDatoCompleto = { ...req.body, motivo: motivoReal };

        // Mapeo Dinámico de Calendarios por Sucursal
        // Idealmente estos IDs deberían venir desde Variables de Entorno (.env)
        const calendarMap = {
            1: process.env.CALENDAR_QUILPUE || 'primary',
            2: process.env.CALENDAR_VINA || 'primary',
            3: process.env.CALENDAR_LACALERA || 'primary'
        };
        const calendarIdTarget = calendarMap[sucursal_id] || 'primary';

        // --- ENVIAR NOTIFICACIONES Y CALENDAR ---
        // Se ejecutan en paralelo y se capturan los errores internamente
        // para no bloquear la respuesta rápida al Frontend.
        
        // Envolvemos el llamado a calendar para capturar y silenciar el error de archivo genérico
        const llamarCalendarioSeguro = async () => {
            try {
                await crearEventoCalendario(citaDatoCompleto, calendarIdTarget);
            } catch (err) {
                if (err.message && (err.message.includes('ENOENT') || err.message.includes('credentials'))) {
                    console.log('Aviso: Credenciales de Calendar pendientes');
                } else {
                    console.error('Error en Calendar:', err.message);
                }
            }
        };

        Promise.allSettled([
            enviarCorreoConfirmacion(email, cliente_nombre, fecha_hora, sucursal_id, motivoReal),
            enviarAlertaAdmin(req.body),
            enviarMensaje(sucursal_id, adminPhone, msgAdmin),
            enviarMensaje(sucursal_id, telefono, msgCliente), // Nuevo mensaje al cliente
            llamarCalendarioSeguro()
        ]).then(results => {
            results.forEach((result, idx) => {
                if (result.status === 'rejected') {
                    console.error(`Error en servicio asíncrono ${idx}:`, result.reason);
                }
            });
        });

        res.status(201).json({ mensaje: 'Cita agendada', id_cita: resultado.insertId });
    } catch (error) {
        console.error("Error general en crearCita:", error);
        res.status(500).json({ mensaje: 'Error al guardar la reserva' });
    }
};

// Función 2: Obtener todas las citas para el Panel de Administrador
const obtenerCitas = async (req, res) => {
    try {
        const query = `
            SELECT citas.*, sucursales.nombre AS sucursal_nombre 
            FROM citas 
            JOIN sucursales ON citas.sucursal_id = sucursales.id 
            ORDER BY citas.id DESC
        `;
        const [rows] = await db.query(query);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener las citas' });
    }
};

// Función 3: Actualizar el estado de la cita (Confirmar / Cancelar) - ¡LA QUE FALTABA!
const actualizarEstadoCita = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body; // 'Confirmada' o 'Cancelada'

        const query = 'UPDATE citas SET estado = ? WHERE id = ?';
        await db.query(query, [estado, id]);

        res.status(200).json({ mensaje: `Cita ${estado.toLowerCase()} exitosamente` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al actualizar el estado de la cita' });
    }
};

// Función 4: Obtener las horas ya ocupadas para un día y sucursal
const obtenerHorasOcupadas = async (req, res) => {
    try {
        const { fecha, sucursal_id } = req.query;
        if (!fecha || !sucursal_id) {
            return res.status(400).json({ mensaje: 'Faltan parámetros' });
        }

        const query = `
            SELECT fecha_hora FROM citas 
            WHERE sucursal_id = ? 
            AND DATE(fecha_hora) = ? 
            AND motivo = 'Revisión oftalmológica'
            AND estado != 'Cancelada'
        `;
        
        const [rows] = await db.query(query, [sucursal_id, fecha]);
        
        // Extraemos solo la hora (HH:mm) para el Frontend
        const horasOcupadas = rows.map(row => {
            const date = new Date(row.fecha_hora);
            return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        });
        
        res.status(200).json(horasOcupadas);
    } catch (error) {
        console.error("Error en obtenerHorasOcupadas:", error);
        res.status(500).json({ mensaje: 'Error al obtener horas ocupadas' });
    }
};

// Función 5: Endpoint administrativo para forzar el deslogueo del WhatsApp de una sucursal
const logoutWhatsApp = async (req, res) => {
    try {
        const { sucursal_id } = req.params;
        
        if (!sucursal_id) {
            return res.status(400).json({ mensaje: 'Se requiere enviar el id de la sucursal' });
        }

        const resultado = await cerrarSesion(sucursal_id);
        res.status(200).json(resultado);
    } catch (error) {
        console.error("Error en logoutWhatsApp:", error);
        res.status(500).json({ mensaje: 'Error al intentar cerrar la sesión de WhatsApp', detalle: error.message });
    }
};

// Exportamos TODAS las funciones
module.exports = {
    crearCita,
    obtenerCitas,
    actualizarEstadoCita,
    obtenerHorasOcupadas,
    logoutWhatsApp
};