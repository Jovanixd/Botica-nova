// config/db.js
const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306, 
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'botica'
});

db.connect((err) => {
  if (err) {
    console.error('❌ Error al conectar a MySQL:', err);
    return;
  }

  // ✅ Establecer zona horaria de Perú (UTC-5)
  db.query("SET time_zone = '-05:00'", (err) => {
    if (err) console.warn('⚠️  No se pudo establecer la zona horaria');
    else console.log('✅ Zona horaria configurada a Perú (-05:00)');
  });

  console.log('✅ Conectado a la base de datos MySQL');
});

module.exports = db;
