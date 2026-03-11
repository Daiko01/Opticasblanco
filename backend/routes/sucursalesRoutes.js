// backend/routes/sucursalesRoutes.js
const express = require('express');
const router = express.Router();
const { obtenerSucursales } = require('../controllers/sucursalesController');

// Cuando alguien visite esta ruta con GET, ejecuta la función obtenerSucursales
router.get('/', obtenerSucursales);

module.exports = router;