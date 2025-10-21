// server/controllers/reporteController.js
const db = require('../config/db');
const XLSX = require('xlsx');

// Reporte de ventas con filtro por fecha
exports.reporteVentas = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    let conditions = [];
    let params = [];

    if (fechaInicio) {
      conditions.push('v.fecha >= ?');
      params.push(fechaInicio);
    }
    if (fechaFin) {
      conditions.push('v.fecha <= ?');
      params.push(fechaFin);
    }

    let whereClause = '';
    if (conditions.length > 0) {
      whereClause = 'WHERE ' + conditions.join(' AND ');
    }

    const query = `
      SELECT 
        v.id AS venta_id,
        v.fecha,
        v.total,
        u.nombre AS vendedor,
        p.nombre AS producto,
        dv.cantidad,
        dv.precio_unitario,
        (dv.cantidad * dv.precio_unitario) AS subtotal
      FROM ventas v
      JOIN detalle_venta dv ON v.id = dv.venta_id
      JOIN productos p ON dv.producto_id = p.id
      JOIN usuarios u ON v.usuario_id = u.id
      ${whereClause}
      ORDER BY v.fecha DESC
    `;

    const [rows] = await db.promise().query(query, params);

    // Convertir a formato plano para Excel
    const data = rows.map(row => ({
      'N° Venta': row.venta_id,
      'Fecha': new Date(row.fecha).toLocaleString('es-PE'),
      'Vendedor': row.vendedor,
      'Producto': row.producto,
      'Cantidad': row.cantidad,
      'Precio Unit.': row.precio_unitario,
      'Subtotal': row.subtotal,
      'Total Venta': row.total
    }));

    // Crear libro de Excel
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Ventas');

    const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    // Generar nombre dinámico
    let filename = 'reporte_ventas.xlsx';
    if (fechaInicio && fechaFin) {
      filename = `reporte_ventas_${fechaInicio}_a_${fechaFin}.xlsx`;
    }

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(excelBuffer);
  } catch (error) {
    console.error('Error en reporteVentas:', error);
    res.status(500).json({ msg: 'Error al generar el reporte de ventas' });
  }
};

// Reporte de inventario (sin filtro de fecha, ya que es estático)
exports.reporteInventario = async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT 
        nombre,
        descripcion,
        precio,
        stock,
        stock_minimo,
        codigo_barra,
        CASE 
          WHEN stock <= stock_minimo THEN 'SÍ' 
          ELSE 'NO' 
        END AS stock_bajo
      FROM productos
      ORDER BY nombre
    `);

    const data = rows.map(row => ({
      'Nombre': row.nombre,
      'Descripción': row.descripcion || '',
      'Precio (S/)': row.precio,
      'Stock': row.stock,
      'Stock Mínimo': row.stock_minimo,
      'Código de Barra': row.codigo_barra || '',
      '¿Stock Bajo?': row.stock_bajo
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventario');

    const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', 'attachment; filename="reporte_inventario.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(excelBuffer);
  } catch (error) {
    console.error('Error en reporteInventario:', error);
    res.status(500).json({ msg: 'Error al generar el reporte de inventario' });
  }
};