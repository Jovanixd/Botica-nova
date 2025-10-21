// server/controllers/dashboardController.js
const db = require('../config/db');

exports.getResumenDiario = async (req, res) => {
  try {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    // Ventas del día
    const [ventasHoy] = await db.promise().query(
      'SELECT SUM(total) as total_ventas FROM ventas WHERE fecha >= ?',
      [hoy]
    );
    const totalVentas = parseFloat(ventasHoy[0].total_ventas) || 0;

    // Productos
    const [productos] = await db.promise().query('SELECT * FROM productos');
    
    // Productos recientes (últimos 7 días)
    const hace7Dias = new Date();
    hace7Dias.setDate(hoy.getDate() - 7);
    const [productosRecientes] = await db.promise().query(
      'SELECT id, nombre, created_at FROM productos WHERE created_at >= ? ORDER BY created_at DESC',
      [hace7Dias]
    );

    const stockBajo = productos.filter(p => p.stock <= p.stock_minimo).length;

    res.json({
      totalVentas: parseFloat(ventasHoy[0].total_ventas) || 0,
      totalProductos: productos.length,
      stockBajo,
      productosRecientes
    });
  } catch (error) {
    console.error('Error en getResumenDiario:', error);
    res.status(500).json({ msg: 'Error al cargar resumen diario' });
  }
};