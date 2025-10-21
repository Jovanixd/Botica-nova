// models/Usuario.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');

class Usuario {
  // Registrar usuario
  static async crear(nombre, email, password, rol = 'vendedor') {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)';
    const [result] = await db.promise().query(query, [nombre, email, hashedPassword, rol]);
    return { id: result.insertId, nombre, email, rol };
  }

  // Buscar por email
  static async findByEmail(email) {
    const query = 'SELECT * FROM usuarios WHERE email = ?';
    const [rows] = await db.promise().query(query, [email]);
    return rows[0];
  }

  // Validar contraseña
  static async validarPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = Usuario;