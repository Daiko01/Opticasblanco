const db = require('./backend/config/db');

async function doIt() {
  try {
    const [rows] = await db.query("SELECT * FROM sucursales");
    console.log(rows);
    process.exit(0);
  } catch(e) { console.error(e); process.exit(1); }
}
doIt();
