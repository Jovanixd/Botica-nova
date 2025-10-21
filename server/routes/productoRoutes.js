// server/routes/productoRoutes.js
const express = require('express');
const router = express.Router();
const {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} = require('../controllers/productoController');

// Middleware de autenticación (opcional por ahora, pero lo agregaremos después)
// const auth = require('../middleware/authMiddleware');

// router.use(auth); // ← descomenta más adelante

router.get('/', obtenerProductos);
router.get('/:id', obtenerProductoPorId);
router.post('/', crearProducto);
router.put('/:id', actualizarProducto);
router.delete('/:id', eliminarProducto);

module.exports = router;