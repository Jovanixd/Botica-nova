// src/services/reporteService.js
import api from './api';
import { saveAs } from 'file-saver';

// Descargar reporte de ventas CON FILTRO y autenticación
export const descargarReporteVentasConFiltro = async (fechaInicio, fechaFin) => {
  const params = new URLSearchParams();
  if (fechaInicio) params.append('fechaInicio', fechaInicio);
  if (fechaFin) params.append('fechaFin', fechaFin);

  const response = await api.get(`/reportes/ventas?${params.toString()}`, {
    responseType: 'blob'
  });

  const blob = new Blob([response.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  const filename = fechaInicio === fechaFin
    ? `ventas_${fechaInicio}.xlsx`
    : `ventas_${fechaInicio}_a_${fechaFin}.xlsx`;

  saveAs(blob, filename);
};

// Descargar inventario (sin cambios)
export const descargarReporteInventario = async () => {
  const response = await api.get('/reportes/inventario', {
    responseType: 'blob'
  });
  const blob = new Blob([response.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  saveAs(blob, 'reporte_inventario.xlsx');
};
export const descargarReporteVentas = () => {
  return descargarReporteVentasConFiltro();
};