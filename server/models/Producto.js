// server/models/Producto.js
const db = require('../config/db');

class Producto {
  // Obtener todos los productos
  static async findAll() {
    const query = `
      SELECT *, 
        (stock <= stock_minimo) AS stock_bajo 
      FROM productos 
      ORDER BY nombre ASC
    `;
    const [rows] = await db.promise().query(query);
    return rows;
  }

  // Obtener un producto por ID
  static async findById(id) {
    const query = 'SELECT * FROM productos WHERE id = ?';
    const [rows] = await db.promise().query(query, [id]);
    return rows[0];
  }

  // Crear producto
  static async create(data) {
    const { nombre, descripcion, precio, stock, stock_minimo, codigo_barra } = data;
    const query = `
      INSERT INTO productos (nombre, descripcion, precio, stock, stock_minimo, codigo_barra)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.promise().query(query, [
      nombre, descripcion, precio, stock, stock_minimo, codigo_barra
    ]);
    return { id: result.insertId, ...data };
  }

  // Actualizar producto
  static async update(id, data) {
    const { nombre, descripcion, precio, stock, stock_minimo, codigo_barra } = data;
    const query = `
      UPDATE productos 
      SET nombre = ?, descripcion = ?, precio = ?, stock = ?, stock_minimo = ?, codigo_barra = ?
      WHERE id = ?
    `;
    await db.promise().query(query, [
      nombre, descripcion, precio, stock, stock_minimo, codigo_barra, id
    ]);
    return { id, ...data };
  }

  // Eliminar producto
  static async delete(id) {
    const query = 'DELETE FROM productos WHERE id = ?';
    await db.promise().query(query, [id]);
  }
}

module.exports = Producto;