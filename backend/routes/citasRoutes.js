// backend/routes/citasRoutes.js
const express = require('express');
const router = express.Router();

// Importamos las funciones del controlador
const { crearCita, obtenerCitas, actualizarEstadoCita, obtenerHorasOcupadas, logoutWhatsApp } = require('../controllers/citasController');

router.post('/', crearCita);                    // Crear cita (Frontend Cliente)
router.get('/ocupadas', obtenerHorasOcupadas);  // Ver horas ocupadas por día y sucursal
router.get('/', obtenerCitas);                  // Ver citas (Panel Admin)
router.patch('/:id', actualizarEstadoCita);     // Actualizar estado (Botones Confirmar/Cancelar del Admin)
router.post('/whatsapp/logout/:sucursal_id', logoutWhatsApp); // Forzar nuevo QR

module.exports = router;