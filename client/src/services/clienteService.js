// src/services/clienteService.js
import api from './api';

const clienteService = {
  obtenerTodos: () => api.get('/clientes'),
  crear: (data) => api.post('/clientes', data),
  actualizar: (id, data) => api.put(`/clientes/${id}`, data),
  eliminar: (id) => api.delete(`/clientes/${id}`)
};

export default clienteService;