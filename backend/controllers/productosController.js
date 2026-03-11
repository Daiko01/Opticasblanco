// backend/controllers/productosController.js
const db = require('../config/db');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Crear directorio si no existe
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Obtener todos los productos
const obtenerProductos = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM productos');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error obteniendo productos:', error);
        res.status(500).json({ mensaje: 'Hubo un error al obtener los productos' });
    }
};

// Obtener un producto por ID con stock por sucursal
const obtenerProductoPorId = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Obtener datos del producto
        const [productos] = await db.query('SELECT * FROM productos WHERE id = ?', [id]);
        if (productos.length === 0) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }
        const producto = productos[0];

        // 2. Intentar obtener stock por sucursal (si la tabla existe)
        let stockPorSucursal = [];
        try {
            const [stock] = await db.query(
                `SELECT s.nombre AS sucursal, s.whatsapp_numero, st.cantidad 
                 FROM stock st 
                 JOIN sucursales s ON st.sucursal_id = s.id 
                 WHERE st.producto_id = ?`,
                [id]
            );
            stockPorSucursal = stock;
        } catch (stockError) {
            const [sucursales] = await db.query('SELECT id, nombre, whatsapp_numero FROM sucursales');
            stockPorSucursal = sucursales.map(s => ({ sucursal: s.nombre, whatsapp_numero: s.whatsapp_numero, cantidad: null }));
        }

        res.status(200).json({ ...producto, stock: stockPorSucursal });
    } catch (error) {
        console.error('Error obteniendo producto:', error);
        res.status(500).json({ mensaje: 'Error al obtener el producto' });
    }
};

// Crear producto
const crearProducto = async (req, res) => {
    try {
        const body = req.body || {};
        const {
            nombre, marca, descripcion, categoria,
            material, colores, medidas, sku,
            oferta, destacado, nuevo
        } = body;

        if (!nombre) {
            return res.status(400).json({ mensaje: 'El nombre es obligatorio' });
        }

        let imagen_url = req.body.imagen_url || '';
        let imagenes_secundarias = req.body.imagenes_secundarias || '';

        // Procesar imágenes si vienen archivos
        if (req.files && req.files.length > 0) {
            const urls = [];
            for (let i = 0; i < req.files.length; i++) {
                const file = req.files[i];
                const filename = `prod-${Date.now()}-${Math.round(Math.random() * 1E9)}.webp`;
                const filepath = path.join(uploadDir, filename);

                await sharp(file.buffer)
                    .webp({ quality: 80 })
                    .toFile(filepath);

                // URL pública
                urls.push(`http://localhost:5000/uploads/${filename}`);
            }

            // La primera es la principal, el resto secundarias
            imagen_url = urls[0];
            if (urls.length > 1) {
                imagenes_secundarias = urls.slice(1).join(',');
            }
        }

        const [result] = await db.query(
            `INSERT INTO productos 
             (nombre, marca, descripcion, categoria, imagen_url, imagenes_secundarias, material, colores, medidas, sku, oferta, destacado, nuevo, estilo, edad, genero) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                nombre,
                marca                || '',
                descripcion          || '',
                categoria            || 'General',
                imagen_url,
                imagenes_secundarias,
                material             || '',
                colores              || '',
                medidas              || '',
                sku                  || '',
                oferta === 'true' || oferta === 1 ? 1 : 0,
                destacado === 'true' || destacado === 1 ? 1 : 0,
                nuevo === 'true' || nuevo === 1 ? 1 : 0,
                estilo               || '',
                edad                 || '',
                genero               || ''
            ]
        );
        res.status(201).json({ mensaje: 'Producto creado', id: result.insertId, imagen_url });
    } catch (error) {
        console.error('Error creando producto:', error);
        res.status(500).json({ mensaje: 'Error al crear producto', detalle: error.message });
    }
};

// Editar producto
const editarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body || {};
        const {
            nombre, marca, descripcion, categoria,
            material, colores, medidas, sku,
            oferta, destacado, nuevo,
            estilo, edad, genero
        } = body;

        // Mantener las existentes si no se suben nuevas (vienen de los campos _existente)
        let imagen_url = req.body.imagen_url_existente || '';
        let imagenes_secundarias = req.body.imagenes_secundarias_existentes || '';

        // Si subieron nuevos archivos, sobreescribir las anteriores
        if (req.files && req.files.length > 0) {
            const urls = [];
            for (let i = 0; i < req.files.length; i++) {
                const file = req.files[i];
                const filename = `prod-${Date.now()}-${Math.round(Math.random() * 1E9)}.webp`;
                const filepath = path.join(uploadDir, filename);

                await sharp(file.buffer)
                    .webp({ quality: 80 })
                    .toFile(filepath);

                urls.push(`http://localhost:5000/uploads/${filename}`);
            }
            imagen_url = urls[0];
            if (urls.length > 1) {
                // Si el front manda las viejas que quiere mantener, podríamos combinarlas.
                // Por simplicidad, aquí reemplazamos las secundarias con las nuevas subidas.
                imagenes_secundarias = urls.slice(1).join(',');
            }
        }

        await db.query(
            `UPDATE productos 
             SET 
                nombre = COALESCE(?, nombre), 
                marca = COALESCE(?, marca), 
                descripcion = COALESCE(?, descripcion), 
                categoria = COALESCE(?, categoria), 
                imagen_url = COALESCE(?, imagen_url), 
                imagenes_secundarias = COALESCE(?, imagenes_secundarias),
                material = COALESCE(?, material), 
                colores = COALESCE(?, colores), 
                medidas = COALESCE(?, medidas), 
                sku = COALESCE(?, sku),
                oferta = ?, 
                destacado = ?, 
                nuevo = ?,
                estilo = COALESCE(?, estilo),
                edad = COALESCE(?, edad),
                genero = COALESCE(?, genero)
             WHERE id = ?`,
            [
                nombre || null, marca || null, descripcion || null, categoria || null,
                imagen_url || null, imagenes_secundarias || null,
                material || null, colores || null, medidas || null, sku || null,
                oferta === 'true' || oferta === 1 ? 1 : 0,
                destacado === 'true' || destacado === 1 ? 1 : 0,
                nuevo === 'true' || nuevo === 1 ? 1 : 0,
                estilo || null,
                edad || null,
                genero || null,
                id
            ]
        );
        res.status(200).json({ mensaje: 'Producto actualizado', imagen_url });
    } catch (error) {
        console.error('Error editando producto:', error);
        res.status(500).json({ mensaje: 'Error al editar producto', detalle: error.message });
    }
};

// Eliminar producto
const eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM productos WHERE id = ?', [id]);
        res.status(200).json({ mensaje: 'Producto eliminado' });
    } catch (error) {
        console.error('Error eliminando producto:', error);
        res.status(500).json({ mensaje: 'Error al eliminar producto' });
    }
};

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    editarProducto,
    eliminarProducto
};