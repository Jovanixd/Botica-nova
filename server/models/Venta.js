// server/models/Venta.js
const db = require('../config/db');

class Venta {
  static async crear(usuarioId, productos) {
    // Usa la conexión directamente (no necesitas getConnection)
    const connection = db.promise(); // ← Esto devuelve una promesa-wrapped connection

    try {
      await connection.beginTransaction();

      // 1. Insertar la venta
      const [ventaResult] = await connection.query(
        'INSERT INTO ventas (usuario_id, total) VALUES (?, ?)',
        [usuarioId, 0]
      );
      const ventaId = ventaResult.insertId;

      let total = 0;

      // 2. Procesar cada producto
      for (const item of productos) {
        const { producto_id, cantidad } = item;

        const [productoRows] = await connection.query(
          'SELECT precio, stock FROM productos WHERE id = ?',
          [producto_id]
        );

        if (productoRows.length === 0) {
          throw new Error(`Producto con ID ${producto_id} no encontrado`);
        }

        const producto = productoRows[0];
        if (producto.stock < cantidad) {
          throw new Error(`Stock insuficiente para el producto ID ${producto_id}`);
        }

        const subtotal = producto.precio * cantidad;
        total += subtotal;

        // Insertar detalle
        await connection.query(
          'INSERT INTO detalle_venta (venta_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
          [ventaId, producto_id, cantidad, producto.precio]
        );

        // Reducir stock
        await connection.query(
          'UPDATE productos SET stock = stock - ? WHERE id = ?',
          [cantidad, producto_id]
        );
      }

      // 3. Actualizar total
      await connection.query(
        'UPDATE ventas SET total = ? WHERE id = ?',
        [total, ventaId]
      );

      await connection.commit();
      return { id: ventaId, total };
    } catch (error) {
      await connection.rollback();
      throw error;
    }
    // ⚠️ No uses connection.release() aquí porque no es un pool
  }

  static async obtenerTodas() {
    const [rows] = await db.promise().query(`
      SELECT v.id, v.fecha, v.total, u.nombre as vendedor,
             dv.cantidad, dv.precio_unitario, p.nombre as producto
      FROM ventas v
      JOIN usuarios u ON v.usuario_id = u.id
      JOIN detalle_venta dv ON v.id = dv.venta_id
      JOIN productos p ON dv.producto_id = p.id
      ORDER BY v.fecha DESC
    `);
    return rows;
  }
}

module.exports = Venta;