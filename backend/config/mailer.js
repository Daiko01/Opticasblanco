// backend/config/mailer.js
const nodemailer = require('nodemailer');

// Configuramos el "cartero" con los datos de Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'nadrak95@gmail.com', // <-- PON TU CORREO AQUÍ
        pass: 'ggsm xduk ilob ybtl'            // <-- PON TU CONTRASEÑA DE APLICACIÓN AQUÍ (Sin espacios)
    }
});

// Función para enviar el correo
const enviarCorreoConfirmacion = async (emailCliente, nombreCliente, fechaHora, sucursal, motivo) => {
    try {
        // Formatear la fecha para que se vea bonita
        const fechaFormateada = new Date(fechaHora).toLocaleString('es-CL');

        // Mapeo estático de sucursales para incluir links precisos de GPS y direcciones
        const sucursalesData = {
            '1': {
                nombre: 'Sucursal Viña del Mar',
                direccion: 'Galería Rapallo - Av. Valparaíso 518, Local 2',
                maps: 'https://www.google.com/maps/search/?api=1&query=Av.+Valparaíso+518+Viña+del+Mar+Chile',
                waze: 'https://waze.com/ul?q=Av.+Valparaiso+518+Vina+del+Mar'
            },
            '2': {
                nombre: 'Sucursal Quilpué',
                direccion: 'Blanco Encalada 992, Local B',
                maps: 'https://www.google.com/maps/search/?api=1&query=Blanco+Encalada+992+Quilpue+Chile',
                waze: 'https://waze.com/ul?q=Blanco+Encalada+992+Quilpue'
            },
            '3': {
                nombre: 'Sucursal La Calera',
                direccion: 'Carrera 988 esq. Huici',
                maps: 'https://www.google.com/maps/search/?api=1&query=Carrera+988+La+Calera+Chile',
                waze: 'https://waze.com/ul?q=Carrera+988+La+Calera'
            }
        };

        const infoSucursal = sucursalesData[String(sucursal)];

        const opcionesCorreo = {
            from: '"Ópticas Blanco" <nadrak95@gmail.com>', // Remitente
            to: emailCliente, // El correo que el cliente puso en el formulario
            subject: 'Confirmación de tu Reserva en Ópticas Blanco',
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; padding: 40px 20px; margin: 0;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        
                        <!-- Encabezado corporativo -->
                        <div style="background-color: #059669; padding: 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">ÓPTICAS BLANCO</h1>
                            <p style="color: #a7f3d0; margin: 10px 0 0 0; font-size: 16px;">Confirmación de Reserva</p>
                        </div>

                        <!-- Contenido principal -->
                        <div style="padding: 40px 30px;">
                            <h2 style="color: #1f2937; margin-top: 0; font-size: 20px;">¡Hola, ${nombreCliente}! 👋</h2>
                            <p style="color: #4b5563; line-height: 1.6; font-size: 16px;">Tu hora ha sido agendada exitosamente en nuestro sistema. Estamos preparándonos para recibirte y brindarte la mejor atención.</p>
                            
                            <!-- Tarjeta de Detalles -->
                            <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 25px 0;">
                                <h3 style="color: #059669; margin-top: 0; margin-bottom: 15px; font-size: 16px; border-bottom: 2px solid #d1fae5; padding-bottom: 8px;">Detalles de tu Cita</h3>
                                
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;" width="120"><strong>📅 Fecha:</strong></td>
                                        <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${fechaFormateada}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;"><strong>🎯 Motivo:</strong></td>
                                        <td style="padding: 8px 0; color: #111827; font-size: 14px;">${motivo}</td>
                                    </tr>
                                    ${infoSucursal ? `
                                    <tr>
                                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;" valign="top"><strong>📍 Sucursal:</strong></td>
                                        <td style="padding: 8px 0; color: #111827; font-size: 14px; line-height: 1.5;">
                                            <strong>${infoSucursal.nombre}</strong><br>
                                            ${infoSucursal.direccion}
                                        </td>
                                    </tr>
                                    ` : `
                                    <tr>
                                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;"><strong>📍 Sucursal:</strong></td>
                                        <td style="padding: 8px 0; color: #111827; font-size: 14px;">ID: ${sucursal}</td>
                                    </tr>
                                    `}
                                </table>
                            </div>

                            <!-- Botones GPS -->
                            ${infoSucursal ? `
                            <div style="text-align: center; margin: 30px 0;">
                                <p style="color: #4b5563; font-size: 14px; margin-bottom: 15px;">¿No sabes cómo llegar? Usa tu GPS preferido:</p>
                                <a href="${infoSucursal.maps}" target="_blank" style="display: inline-block; padding: 12px 20px; background-color: #4285F4; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; margin: 0 5px;">🗺️ Google Maps</a>
                                <a href="${infoSucursal.waze}" target="_blank" style="display: inline-block; padding: 12px 20px; background-color: #33ccff; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; margin: 0 5px;">🚙 Waze</a>
                            </div>
                            ` : ''}

                            <!-- Pie del mensaje -->
                            <p style="color: #4b5563; font-size: 15px; line-height: 1.6; border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
                                Si necesitas cancelar o reprogramar tu cita, por favor contáctanos con anticipación a través de nuestro WhatsApp oficial.
                            </p>
                            
                            <p style="color: #1f2937; margin-top: 30px; font-weight: bold; font-size: 16px;">
                                ¡Nos vemos pronto!<br>
                                <span style="color: #059669;">Equipo Ópticas Blanco</span>
                            </p>
                        </div>
                        
                        <!-- Footer -->
                        <div style="background-color: #f9fafb; padding: 15px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="color: #9ca3af; font-size: 12px; margin: 0;">Este es un correo automático, por favor no respondas a este mensaje.</p>
                        </div>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(opcionesCorreo);
        console.log('Correo enviado exitosamente a:', emailCliente);
    } catch (error) {
        console.error('Error al enviar el correo:', error);
    }
};

// Función para enviar alerta al DUEÑO / ADMIN
const enviarAlertaAdmin = async (datosCita) => {
    try {
        const { cliente_nombre, rut, telefono, email, fecha_hora, sucursal_id, motivo } = datosCita;
        const fechaFormateada = new Date(fecha_hora).toLocaleString('es-CL');
        
        // Limpiar el teléfono para el link de whatsapp (dejando solo números y el +)
        const telefonoLimpio = telefono ? telefono.replace(/[^\d+]/g, '') : '';
        const whatsappLink = `https://wa.me/${telefonoLimpio}`;
        // Mapeo estático de sucursales para el nombre y dirección en el correo del administrador
        const sucursalesData = {
            '1': 'Sucursal Viña del Mar',
            '2': 'Sucursal Quilpué',
            '3': 'Sucursal La Calera'
        };
        const nombreSucursal = sucursalesData[String(sucursal_id)] || `ID: ${sucursal_id}`;

        const opcionesCorreo = {
            from: '"Ópticas Blanco Sistema" <nadrak95@gmail.com>',
            to: 'nadrak95@gmail.com', // El correo del dueño/admin
            subject: '🚨 NUEVA RESERVA RECIBIDA - Ópticas Blanco',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #e5e7eb; border-radius: 8px;">
                    <h2 style="color: #ef4444; border-bottom: 2px solid #ef4444; padding-bottom: 10px;">🚨 Nueva Reserva de Hora</h2>
                    <p>Se ha registrado un nuevo agendamiento en el sistema web. A continuación los detalles:</p>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; background-color: #f9fafb;"><strong>👤 Paciente:</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${cliente_nombre}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; background-color: #f9fafb;"><strong>🪪 RUT:</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${rut}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; background-color: #f9fafb;"><strong>📱 Teléfono:</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
                                ${telefono} <br>
                                <a href="${whatsappLink}" style="display: inline-block; margin-top: 5px; padding: 5px 10px; background-color: #25D366; color: white; text-decoration: none; border-radius: 4px; font-size: 13px;">💬 Hablar por WhatsApp</a>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; background-color: #f9fafb;"><strong>✉️ Email:</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${email}">${email}</a></td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; background-color: #f9fafb;"><strong>📅 Fecha y Hora:</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #117b3d;">${fechaFormateada}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; background-color: #f9fafb;"><strong>🎯 Motivo:</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${motivo || 'Consulta General'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; background-color: #f9fafb;"><strong>📍 Sucursal:</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">${nombreSucursal}</td>
                        </tr>
                    </table>
                    
                    <p style="margin-top: 20px; font-size: 12px; color: #6b7280; text-align: center;">Este es un correo automático generado por el Sistema de Reservas de Ópticas Blanco.</p>
                </div>
            `
        };

        await transporter.sendMail(opcionesCorreo);
        console.log('Alerta de nueva reserva enviada al Administrador.');
    } catch (error) {
        console.error('Error al enviar alerta al admin:', error);
    }
};

module.exports = { enviarCorreoConfirmacion, enviarAlertaAdmin };