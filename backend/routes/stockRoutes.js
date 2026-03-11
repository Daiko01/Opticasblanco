// backend/routes/stockRoutes.js
const express = require('express');
const router = express.Router();
const { obtenerTodoElStock, obtenerStockProducto, actualizarStock } = require('../controllers/stockController');

router.get('/', obtenerTodoElStock);
router.get('/:productoId', obtenerStockProducto);
router.put('/', actualizarStock);

module.exports = router;
