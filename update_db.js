const db = require('./backend/config/db');

async function updateDB() {
  try {
    console.log("Iniciando actualización de base de datos para la tabla Citas...");
    
    // Añadir columna motivo si no existe
    try {
      await db.query("ALTER TABLE citas ADD COLUMN motivo VARCHAR(100) DEFAULT 'Sin Especificar';");
      console.log("Columna 'motivo' añadida exitosamente a la tabla 'citas'.");
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log("La columna 'motivo' ya existe en 'citas'.");
      } else {
        throw err;
      }
    }
    
    console.log("Actualización finalizada exitosamente.");
    process.exit(0);
  } catch (error) {
    console.error("Error actualizando la base de datos:", error);
    process.exit(1);
  }
}

updateDB();
