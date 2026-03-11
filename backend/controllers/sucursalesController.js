// backend/controllers/sucursalesController.js
const db = require('../config/db');

// Función para obtener todas las sucursales
const obtenerSucursales = async (req, res) => {
    try {
        // Hacemos la consulta a MySQL
        const [rows] = await db.query('SELECT * FROM sucursales');
        
        // Respondemos con los datos en formato JSON
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error obteniendo sucursales:', error);
        res.status(500).json({ mensaje: 'Hubo un error al obtener las sucursales' });
    }
};

module.exports = {
    obtenerSucursales
};