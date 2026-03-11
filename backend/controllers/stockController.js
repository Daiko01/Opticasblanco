// backend/controllers/stockController.js
const db = require('../config/db');

// Obtener stock de un producto en todas las sucursales
const obtenerStockProducto = async (req, res) => {
    try {
        const { productoId } = req.params;
        const [rows] = await db.query(
            `SELECT st.id, st.sucursal_id, s.nombre AS sucursal_nombre, st.cantidad 
             FROM stock st 
             JOIN sucursales s ON st.sucursal_id = s.id 
             WHERE st.producto_id = ?`,
            [productoId]
        );
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error obteniendo stock:', error);
        res.status(500).json({ mensaje: 'Error al obtener el stock' });
    }
};

// Obtener todo el stock (todos los productos x todas las sucursales)
const obtenerTodoElStock = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT st.id, st.producto_id, p.nombre AS producto_nombre, 
                    st.sucursal_id, s.nombre AS sucursal_nombre, st.cantidad
             FROM stock st 
             JOIN productos p ON st.producto_id = p.id 
             JOIN sucursales s ON st.sucursal_id = s.id 
             ORDER BY p.nombre, s.nombre`
        );
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error obteniendo stock:', error);
        res.status(500).json({ mensaje: 'Error al obtener el stock' });
    }
};

// Actualizar stock (si existe, actualiza; si no, inserta)
const actualizarStock = async (req, res) => {
    try {
        const { producto_id, sucursal_id, cantidad } = req.body;
        if (!producto_id || !sucursal_id || cantidad === undefined) {
            return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
        }

        // Verificar si ya existe el registro
        const [existente] = await db.query(
            'SELECT id FROM stock WHERE producto_id = ? AND sucursal_id = ?',
            [producto_id, sucursal_id]
        );

        if (existente.length > 0) {
            await db.query(
                'UPDATE stock SET cantidad = ? WHERE producto_id = ? AND sucursal_id = ?',
                [cantidad, producto_id, sucursal_id]
            );
        } else {
            await db.query(
                'INSERT INTO stock (producto_id, sucursal_id, cantidad) VALUES (?, ?, ?)',
                [producto_id, sucursal_id, cantidad]
            );
        }

        res.status(200).json({ mensaje: 'Stock actualizado' });
    } catch (error) {
        console.error('Error actualizando stock:', error);
        res.status(500).json({ mensaje: 'Error al actualizar el stock' });
    }
};

module.exports = {
    obtenerStockProducto,
    obtenerTodoElStock,
    actualizarStock
};
