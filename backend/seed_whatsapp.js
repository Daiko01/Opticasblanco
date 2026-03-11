// backend/seed_whatsapp.js
// Script de carga inicial: registra los números de WhatsApp de cada sucursal.
// Ejecutar UNA VEZ: node seed_whatsapp.js
// Puedes modificar los números antes de ejecutar.
require('dotenv').config();
const mysql = require('mysql2/promise');

// ─── EDITA ESTOS NÚMEROS (formato: 569XXXXXXXX sin + ni espacios) ────────────
const WHATSAPP_SUCURSALES = [
  { nombre: 'Viña del Mar', whatsapp_numero: '56912345678' },
  { nombre: 'Quilpué',      whatsapp_numero: '56987654321' },
  { nombre: 'La Calera',    whatsapp_numero: '56911223344' },
];
// ─────────────────────────────────────────────────────────────────────────────

async function seed() {
  let conn;
  try {
    conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'optica_sistema',
    });

    console.log('✅ Conectado. Actualizando números de WhatsApp...\n');

    for (const s of WHATSAPP_SUCURSALES) {
      const [res] = await conn.query(
        'UPDATE sucursales SET whatsapp_numero = ? WHERE nombre = ?',
        [s.whatsapp_numero, s.nombre]
      );
      if (res.affectedRows > 0) {
        console.log(`  ✅ ${s.nombre} → wa.me/${s.whatsapp_numero}`);
      } else {
        console.log(`  ⚠️  "${s.nombre}" no encontrada en la base de datos.`);
      }
    }

    console.log('\n🎉 Números de WhatsApp cargados. Recarga los datos en el frontend.\n');
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    if (conn) await conn.end();
  }
}

seed();
