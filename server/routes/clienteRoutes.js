// server/routes/clienteRoutes.js
const express = require('express');
const router = express.Router();
const { obtenerClientes, crearCliente, actualizarCliente, eliminarCliente } = require('../controllers/clienteController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', obtenerClientes);
router.post('/', crearCliente);
router.put('/:id', actualizarCliente);
router.delete('/:id', eliminarCliente);

module.exports = router;