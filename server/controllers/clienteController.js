// server/controllers/clienteController.js
const db = require('../config/db');

exports.obtenerClientes = async (req, res) => {
    try {
        const [rows] = await db.promise().query('SELECT * FROM clientes ORDER BY nombre');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ msg: 'Error al obtener clientes' });
    }
};

exports.crearCliente = async (req, res) => {
    try {
        const { nombre, documento, telefono, email, direccion } = req.body;
        const [result] = await db.promise().query(
            'INSERT INTO clientes (nombre, documento, telefono, email, direccion) VALUES (?, ?, ?, ?, ?)',
            [nombre, documento, telefono, email, direccion]
        );
        res.status(201).json({ id: result.insertId, nombre, documento, telefono, email, direccion });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error al crear cliente' });
    }
};

exports.actualizarCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, documento, telefono, email, direccion } = req.body;
        const [result] = await db.promise().query(
            'UPDATE clientes SET nombre = ?, documento = ?, telefono = ?, email = ?, direccion = ? WHERE id = ?',
            [nombre, documento, telefono, email, direccion, id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ msg: 'Cliente no encontrado' });
        res.json({ id, nombre, documento, telefono, email, direccion });
    } catch (err) {
        res.status(500).json({ msg: 'Error al actualizar cliente' });
    }
};

exports.eliminarCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.promise().query('DELETE FROM clientes WHERE id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ msg: 'Cliente no encontrado' });
        res.json({ msg: 'Cliente eliminado' });
    } catch (err) {
        res.status(500).json({ msg: 'Error al eliminar cliente' });
    }
};