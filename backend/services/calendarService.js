const { google } = require('googleapis');
const path = require('path');

// =======================================================================
// IMPORTANTE: CONFIGURACIÓN DE CREDENCIALES
// 1. Necesitas descargar el archivo JSON de tu Service Account de Google Cloud
// 2. Coloca ese archivo en: backend/config/google-credentials.json
// 3. Opcional: Para producción, define la ruta en el archivo .env como GOOGLE_APPLICATION_CREDENTIALS
// 4. MÉTETE EN TU GOOGLE CALENDAR (interfaz web de Calendar):
//    Comparte el calendario objetivo con el correo del Service Account y dale permisos para hacer cambios.
// =======================================================================

// Intentar cargar credenciales desde variable de entorno o archivo hardcodeado
const keyFilePath = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(__dirname, '../config/google-credentials.json');

const auth = new google.auth.GoogleAuth({
    keyFile: keyFilePath,
    scopes: ['https://www.googleapis.com/auth/calendar']
});

const calendar = google.calendar({ version: 'v3', auth });

// Si usamos una cuenta central con sub-calendarios o credenciales dinámicas, 
// no definiremos el CALENDAR_ID hardcodeado, sino que se inyectará.

/**
 * Crea un evento en Google Calendar para una cita
 * @param {Object} citaDatos - Información de la cita (sucursal, cliente, fecha_hora, etc)
 * @param {string} calendarId - ID del sub-calendario para esta sucursal específica
 */
const crearEventoCalendario = async (citaDatos, calendarId = 'primary') => {
    try {
        // Asumiendo que fecha_hora viene en formato de la base de datos o ISO (ej: 2026-03-08T14:30:00)
        // Y que la cita dura 30 minutos (ajusta según la regla de negocio)
        const fechaInicio = new Date(citaDatos.fecha_hora);
        const fechaFin = new Date(fechaInicio.getTime() + 30 * 60000); // +30 minutos

        const event = {
            summary: `Cita: ${citaDatos.motivo} - ${citaDatos.cliente_nombre}`,
            description: `
                Reservado para: ${citaDatos.cliente_nombre}
                RUT: ${citaDatos.rut}
                Teléfono: ${citaDatos.telefono}
                Email: ${citaDatos.email}
                Motivo: ${citaDatos.motivo}
            `.trim(),
            start: {
                dateTime: fechaInicio.toISOString(),
                timeZone: 'America/Santiago', // Ajusta la zona horaria según tu ubicación
            },
            end: {
                dateTime: fechaFin.toISOString(),
                timeZone: 'America/Santiago',
            },
            // Opcional: Añadir recordatorio
            reminders: {
                useDefault: false,
                overrides: [
                    { method: 'popup', minutes: 60 },
                ],
            },
        };

        const response = await calendar.events.insert({
            calendarId: calendarId,
            resource: event,
        });

        console.log(`Evento de Google Calendar creado: ${response.data.htmlLink}`);
        return response.data;
    } catch (error) {
        console.error('Error al crear evento en Google Calendar:', error.message);
        throw error;
    }
};

module.exports = {
    crearEventoCalendario
};
