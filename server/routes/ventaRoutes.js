// server/routes/ventaRoutes.js
const express = require('express');
const router = express.Router();
const { crearVenta, obtenerVentas } = require('../controllers/ventaController');
const authMiddleware = require('../middleware/authMiddleware');

// Proteger todas las rutas de ventas
router.use(authMiddleware);

router.post('/', crearVenta);
router.get('/', obtenerVentas);

module.exports = router;