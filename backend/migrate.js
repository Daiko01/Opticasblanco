// backend/migrate.js
// Script de migración segura para agregar nuevas columnas al schema existente.
// Ejecutar UNA VEZ: node migrate.js
require('dotenv').config();
const mysql = require('mysql2/promise');

const alteraciones = [
  // Tabla productos: nuevos campos del catálogo (sin precio en public)
  {
    tabla: 'productos',
    columna: 'material',
    sql: "ALTER TABLE productos ADD COLUMN material VARCHAR(150) DEFAULT NULL COMMENT 'Ej: Acetato, Metal, TR-90'"
  },
  {
    tabla: 'productos',
    columna: 'colores',
    sql: "ALTER TABLE productos ADD COLUMN colores VARCHAR(255) DEFAULT NULL COMMENT 'Ej: Negro, Carey, Azul'"
  },
  {
    tabla: 'productos',
    columna: 'medidas',
    sql: "ALTER TABLE productos ADD COLUMN medidas VARCHAR(100) DEFAULT NULL COMMENT 'Ej: 52-18-145'"
  },
  // Tabla sucursales: número de WhatsApp por local
  {
    tabla: 'sucursales',
    columna: 'whatsapp_numero',
    sql: "ALTER TABLE sucursales ADD COLUMN whatsapp_numero VARCHAR(20) DEFAULT NULL COMMENT 'Formato: 56912345678 (sin + ni espacios)'"
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

    console.log('✅ Conectado a MySQL. Iniciando migración...\n');

    for (const alt of alteraciones) {
      try {
        // Verificar si la columna ya existe antes de intentar agregarla
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

    // Actualizar datos de ejemplo en sucursales (números de WhatsApp)
    console.log('\n📞 Verificando datos de WhatsApp en sucursales...');
    const [sucursales] = await conn.query('SELECT id, nombre, whatsapp_numero FROM sucursales');
    if (sucursales.length > 0) {
      for (const s of sucursales) {
        if (!s.whatsapp_numero) {
          console.log(`  ⚠️  Sucursal "${s.nombre}" (id=${s.id}) no tiene whatsapp_numero. Actualiza manualmente.`);
        } else {
          console.log(`  ✅  Sucursal "${s.nombre}" → wa.me/${s.whatsapp_numero}`);
        }
      }
    }

    console.log('\n🎉 Migración completada exitosamente.');
  } catch (err) {
    console.error('\n❌ Error general en la migración:', err.message);
    process.exit(1);
  } finally {
    if (conn) await conn.end();
    process.exit(0);
  }
}

migrar();
