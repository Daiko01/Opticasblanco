// backend/routes/productosRoutes.js
const express = require('express');
const router = express.Router();
const { 
    obtenerProductos, 
    obtenerProductoPorId, 
    crearProducto, 
    editarProducto, 
    eliminarProducto 
} = require('../controllers/productosController');
const multer = require('multer');

// Configuración de multer en memoria (para que sharp pueda procesarlo antes de guardar)
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // Límite de 5MB por imagen
});

// Rutas de productos
router.get('/', obtenerProductos);
router.get('/:id', obtenerProductoPorId);
// Aceptar hasta 5 imágenes en el campo 'imagenes'
router.post('/', upload.array('imagenes', 5), crearProducto);
router.put('/:id', upload.array('imagenes', 5), editarProducto);
router.delete('/:id', eliminarProducto);

module.exports = router;