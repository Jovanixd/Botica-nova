// server/routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const { getResumenDiario } = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);
router.get('/resumen-diario', getResumenDiario);

module.exports = router;