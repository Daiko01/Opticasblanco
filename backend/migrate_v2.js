// backend/migrate_v2.js
require('dotenv').config();
const mysql = require('mysql2/promise');

const alteraciones = [
  {
    tabla: 'productos',
    columna: 'oferta',
    sql: "ALTER TABLE productos ADD COLUMN oferta TINYINT(1) DEFAULT 0 COMMENT '1 si está en oferta'"
  },
  {
    tabla: 'productos',
    columna: 'destacado',
    sql: "ALTER TABLE productos ADD COLUMN destacado TINYINT(1) DEFAULT 0 COMMENT '1 si es producto destacado'"
  },
  {
    tabla: 'productos',
    columna: 'nuevo',
    sql: "ALTER TABLE productos ADD COLUMN nuevo TINYINT(1) DEFAULT 0 COMMENT '1 si es un nuevo ingreso'"
  }
];

async function migrar() {
  let conn;
  try {
    conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'optica_sistema',
    });

    console.log('✅ Conectado a MySQL. Iniciando migración v2...\n');

    for (const alt of alteraciones) {
      try {
        const [rows] = await conn.query(
          `SELECT COUNT(*) AS cnt 
           FROM information_schema.COLUMNS 
           WHERE TABLE_SCHEMA = DATABASE() 
             AND TABLE_NAME = ? 
             AND COLUMN_NAME = ?`,
          [alt.tabla, alt.columna]
        );

        if (rows[0].cnt > 0) {
          console.log(`  ⏭️  ${alt.tabla}.${alt.columna} — columna ya existe, se omite.`);
        } else {
          await conn.query(alt.sql);
          console.log(`  ✅  ${alt.tabla}.${alt.columna} — columna agregada correctamente.`);
        }
      } catch (err) {
        console.error(`  ❌  Error en ${alt.tabla}.${alt.columna}:`, err.message);
      }
    }

    console.log('\n🎉 Migración v2 completada exitosamente.');
  } catch (err) {
    console.error('\n❌ Error general en la migración:', err.message);
    process.exit(1);
  } finally {
    if (conn) await conn.end();
    process.exit(0);
  }
}

migrar();
