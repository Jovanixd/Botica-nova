// client/src/services/ventaService.js
import api from './api';

const ventaService = {
  crear: (data) => api.post('/ventas', data),
  obtenerTodas: () => api.get('/ventas')
};

export default ventaService;