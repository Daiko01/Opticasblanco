const db = require('../config/db');
const { enviarCorreoConfirmacion, enviarAlertaAdmin } = require('../config/mailer');

// Helper para sanitizar strings (evitar XSS básico)
const sanitizar = (str) => {
    if (typeof str !== 'string') return str;
    return str.replace(/[<>]/g, '').trim(); 
};


// Función 1: Guardar una cita nueva y enviar el correo
const crearCita = async (req, res) => {
    try {
        let { sucursal_id, cliente_nombre, rut, telefono, email, fecha_hora, motivo } = req.body;
        
        // 1. Validación de presencia
        if (!sucursal_id || !cliente_nombre || !rut || !fecha_hora || !email || !telefono) {
            return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
        }

        // 2. Sanitización básica
        cliente_nombre = sanitizar(cliente_nombre);
        rut = sanitizar(rut);
        telefono = sanitizar(telefono);
        email = sanitizar(email).toLowerCase();
        motivo = sanitizar(motivo);

        // 3. Validaciones de formato
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ mensaje: 'Formato de email inválido' });
        }

        const telRegex = /^[0-9+ \-()]{7,20}$/;
        if (!telRegex.test(telefono)) {
            return res.status(400).json({ mensaje: 'Formato de teléfono inválido' });
        }

        if (isNaN(Date.parse(fecha_hora))) {
            return res.status(400).json({ mensaje: 'Formato de fecha u hora inválido' });
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

        const citaDatoCompleto = { ...req.body, motivo: motivoReal };

        // --- ENVIAR NOTIFICACIONES ---
        // Se ejecutan en paralelo y se capturan los errores internamente
        // para no bloquear la respuesta rápida al Frontend.

        // Enviar notificación a WhatsApp usando CallMeBot
        const waCredentialsMap = {
            1: { phone: process.env.WA_PHONE_VINA, key: process.env.WA_KEY_VINA },       // Viña es ID 1
            2: { phone: process.env.WA_PHONE_QUILPUE, key: process.env.WA_KEY_QUILPUE }, // Quilpué es ID 2
            3: { phone: process.env.WA_PHONE_LACALERA, key: process.env.WA_KEY_LACALERA }
        };

        const enviarWhatsAppCallMeBot = async () => {
            const waTarget = waCredentialsMap[sucursal_id];
            if (!waTarget || !waTarget.phone || !waTarget.key) {
                console.log('Aviso: Credenciales de WhatsApp no configuradas para esta sucursal.');
                return;
            }
            try {
                const textoMensaje = `*Nueva Cita*\nNombre: ${cliente_nombre}\nFecha y Hora: ${fechaFormateada}\nTeléfono: ${telefono}`;
                const encodedText = encodeURIComponent(textoMensaje);
                const url = `https://api.callmebot.com/whatsapp.php?phone=${waTarget.phone}&text=${encodedText}&apikey=${waTarget.key}`;
                
                const response = await fetch(url);
                if (response.ok) {
                    console.log('Notificación de WhatsApp enviada exitosamente a la sucursal.');
                } else {
                    console.error('Fallo al enviar WhatsApp a CallMeBot, status:', response.status);
                }
            } catch (err) {
                console.error('Error enviando WhatsApp:', err.message);
            }
        };

        Promise.allSettled([
            enviarCorreoConfirmacion(email, cliente_nombre, fecha_hora, sucursal_id, motivoReal),
            enviarAlertaAdmin(req.body),
            enviarWhatsAppCallMeBot()
        ]).then(results => {
            results.forEach((result, idx) => {
                if (result.status === 'rejected') {
                    console.error(`Error en servicio asíncrono ${idx}:`, result.reason);
                }
            });
        });

        res.status(201).json({ mensaje: 'Cita agendada', id_cita: resultado.insertId });
    } catch (error) {
        // Condición de carrera: el UNIQUE INDEX rechazó un INSERT duplicado
        if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
            return res.status(409).json({
                mensaje: 'Lo sentimos, este bloque horario acaba de ser reservado por otra persona. Por favor, selecciona otro.'
            });
        }
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


// Exportamos TODAS las funciones
module.exports = {
    crearCita,
    obtenerCitas,
    actualizarEstadoCita,
    obtenerHorasOcupadas
};