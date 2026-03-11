// backend/migrate_v3.js
const db = require('./config/db');

async function runMigration() {
    try {
        console.log("Iniciando migración V3 - Agregando campos estilo, edad, genero a productos...");

        await db.query(`
            ALTER TABLE productos
            ADD COLUMN estilo VARCHAR(100) DEFAULT NULL,
            ADD COLUMN edad VARCHAR(100) DEFAULT NULL,
            ADD COLUMN genero VARCHAR(100) DEFAULT NULL;
        `);

        console.log("✅ Columnas estilo, edad y genero agregadas con éxito a la tabla productos.");
        process.exit(0);
    } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
            console.log("⚠️ Las columnas ya existen en la tabla.");
            process.exit(0);
        } else {
            console.error("❌ Error en la migración:", error);
            process.exit(1);
        }
    }
}

runMigration();
