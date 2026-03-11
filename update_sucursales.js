require('dotenv').config({ path: './backend/.env' });
const db = require('./backend/config/db');

async function doIt() {
  try {
    await db.query("UPDATE sucursales SET nombre = 'Viña del Mar', direccion = 'Galería Rapallo - Av. Valparaíso 518, Local 2' WHERE id = 1");
    await db.query("UPDATE sucursales SET nombre = 'Quilpué', direccion = 'Blanco Encalada 992, Local B' WHERE id = 2");
    await db.query("UPDATE sucursales SET nombre = 'La Calera', direccion = 'Carrera 988 esq. Huici' WHERE id = 3");
    
    console.log("Sucursales actualizadas con las direcciones correctas.");
    process.exit(0);
  } catch(e) { console.error(e); process.exit(1); }
}
doIt();
