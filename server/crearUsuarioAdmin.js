// crearUsuarioAdmin.js
const bcrypt = require('bcryptjs');
const db = require('./config/db');

// 🔑 Configura aquí tu contraseña deseada
const EMAIL = 'admin@gmail.com';
const PASSWORD = '123456'; // ← cámbiala si quieres otra
const NOMBRE = 'Administrador';
const ROL = 'admin';

bcrypt.hash(PASSWORD, 10, (err, hash) => {
  if (err) {
    console.error('❌ Error al hashear la contraseña:', err);
    return;
  }

  // Elimina cualquier usuario con ese email (evita duplicados)
  const deleteQuery = 'DELETE FROM usuarios WHERE email = ?';
  db.query(deleteQuery, [EMAIL], (err) => {
    if (err) console.warn('Advertencia al limpiar:', err.message);

    // Inserta el nuevo usuario
    const insertQuery = 'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)';
    db.query(insertQuery, [NOMBRE, EMAIL, hash, ROL], (err, result) => {
      if (err) {
        console.error('❌ Error al crear usuario:', err);
        return;
      }
      console.log('✅ Usuario creado con éxito');
      console.log('📧 Email: ', EMAIL);
      console.log('🔑 Contraseña: ', PASSWORD);
      console.log('🧍 Rol: ', ROL);
      db.end();
    });
  });
});