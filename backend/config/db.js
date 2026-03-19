const mysql = require('mysql2/promise');
require('dotenv').config({ override: true });

// Creamos un "pool" de conexiones (es más eficiente y escalable)
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Comprobamos la conexión inicial
pool.getConnection()
    .then(connection => {
        console.log('✅ Conectado a la base de datos MySQL de la Óptica exitosamente.');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Error conectando a la base de datos:', err.message);
    });

module.exports = pool;