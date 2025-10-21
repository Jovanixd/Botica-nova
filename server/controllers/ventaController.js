// server/controllers/ventaController.js
const Venta = require('../models/Venta');
const db = require('../config/db');

// Controlador para crear una nueva venta
exports.crearVenta = async (req, res) => {
  try {
    const { productos, cliente_id } = req.body;
    const usuarioId = req.user.id;

    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ msg: 'Debe incluir al menos un producto' });
    }

    const connection = db.promise();
    await connection.beginTransaction();

    // Insertar la venta (total provisional = 0)
    const [ventaResult] = await connection.query(
      'INSERT INTO ventas (usuario_id, cliente_id, total) VALUES (?, ?, ?)',
      [usuarioId, cliente_id || null, 0]
    );
    const ventaId = ventaResult.insertId;

    let total = 0;
    const detalles = [];

    // Procesar cada producto del carrito
    for (const item of productos) {
      const { producto_id, cantidad } = item;

      // Validar que el producto exista y tenga stock
      const [productoRows] = await connection.query(
        'SELECT id, nombre, precio, stock FROM productos WHERE id = ?',
        [producto_id]
      );

      if (productoRows.length === 0) {
        throw new Error(`Producto con ID ${producto_id} no encontrado`);
      }

      const producto = productoRows[0];
      if (producto.stock < cantidad) {
        throw new Error(`Stock insuficiente para: ${producto.nombre}`);
      }

      const subtotal = producto.precio * cantidad;
      total += subtotal;

      // Registrar detalle de venta
      await connection.query(
        'INSERT INTO detalle_venta (venta_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
        [ventaId, producto_id, cantidad, producto.precio]
      );

      // Reducir stock del producto
      await connection.query(
        'UPDATE productos SET stock = stock - ? WHERE id = ?',
        [cantidad, producto_id]
      );

      // Guardar para la boleta
      detalles.push({
        nombre: producto.nombre,
        cantidad,
        precio_unitario: producto.precio,
        subtotal
      });
    }

    // Actualizar el total real de la venta
    await connection.query('UPDATE ventas SET total = ? WHERE id = ?', [total, ventaId]);

    // Obtener nombre del vendedor
    const [vendedorRows] = await connection.query(
      'SELECT nombre FROM usuarios WHERE id = ?',
      [usuarioId]
    );
    const vendedor = vendedorRows[0]?.nombre || 'Desconocido';

    await connection.commit();
    
    let cliente = null;
    if (cliente_id) {
      const [clienteRows] = await connection.query(
        'SELECT nombre, documento FROM clientes WHERE id = ?',
        [cliente_id]
      );
      if (clienteRows.length > 0) {
        cliente = clienteRows[0];
      }
    }

    // Responder con datos para la boleta
    res.status(201).json({
      id: ventaId,
      fecha: new Date().toISOString(),
      total,
      vendedor,
      cliente,
      detalles
    });
  } catch (error) {
    console.error('Error en crearVenta:', error);
    res.status(500).json({ msg: error.message || 'Error al registrar la venta' });
  }
};
// server/controllers/ventaController.js
exports.obtenerVentas = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    let query = 'SELECT * FROM ventas ORDER BY fecha DESC';
    let params = [];

    if (fechaInicio || fechaFin) {
      query = 'SELECT * FROM ventas WHERE 1=1';
      if (fechaInicio) {
        query += ' AND fecha >= ?';
        params.push(fechaInicio);
      }
      if (fechaFin) {
        query += ' AND fecha <= ?';
        params.push(fechaFin);
      }
      query += ' ORDER BY fecha DESC';
    }

    const [rows] = await db.promise().query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error en obtenerVentas:', error);
    res.status(500).json({ msg: 'Error al obtener las ventas' });
  }
};