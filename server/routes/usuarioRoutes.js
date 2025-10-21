// server/routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();
const {
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
} = require('../controllers/usuarioController');
const authMiddleware = require('../middleware/authMiddleware');

// Proteger todas las rutas
router.use(authMiddleware);

// Solo permitir si es admin (opcional, puedes agregar validación adicional)
router.get('/', obtenerUsuarios);
router.post('/', crearUsuario);
router.put('/:id', actualizarUsuario);
router.delete('/:id', eliminarUsuario);

module.exports = router;