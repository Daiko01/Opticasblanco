// backend/server.js
const express = require('express');
const cors = require('cors');
const compression = require('compression');
require('dotenv').config();

// Inicializamos la aplicación
const app = express();

// ── Middlewares de rendimiento y seguridad ──────────────────────────────────
// compresión Gzip para todas las respuestas JSON (Web Quality)
app.use(compression());
app.use(cors());
app.use(express.json());

// Exponer la carpeta uploads para que las imágenes sean públicas
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Importamos la conexión a la base de datos
const db = require('./config/db');

// ── Rutas ───────────────────────────────────────────────────────────────────
const sucursalesRoutes = require('./routes/sucursalesRoutes');
const productosRoutes  = require('./routes/productosRoutes');
const citasRoutes      = require('./routes/citasRoutes');
const stockRoutes      = require('./routes/stockRoutes');

app.use('/api/sucursales', sucursalesRoutes);
app.use('/api/productos',  productosRoutes);
app.use('/api/citas',      citasRoutes);
app.use('/api/stock',      stockRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('El servidor de Ópticas Blanco está funcionando correctamente 👓');
});

// ── Manejo global de errores ────────────────────────────────────────────────
// 404 – ruta no encontrada
app.use((req, res) => {
    res.status(404).json({ mensaje: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

// 500 – error inesperado en cualquier controlador
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    console.error('❌ Error no controlado:', err);
    res.status(500).json({ mensaje: 'Error interno del servidor', detalle: err.message });
});

// ── Arranque ─────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});