// server/routes/reporteRoutes.js
const express = require('express');
const router = express.Router();
const { reporteVentas, reporteInventario } = require('../controllers/reporteController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/ventas', reporteVentas);
router.get('/inventario', reporteInventario);

module.exports = router;