// src/services/usuarioService.js
import api from './api';

const usuarioService = {
  obtenerTodos: () => api.get('/usuarios'),
  crear: (data) => api.post('/usuarios', data),
  actualizar: (id, data) => api.put(`/usuarios/${id}`, data),
  eliminar: (id) => api.delete(`/usuarios/${id}`)
};

export default usuarioService;