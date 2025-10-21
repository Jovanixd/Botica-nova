// controllers/authController.js
const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Registro (opcional, solo si quieres permitir crear usuarios desde la app)
exports.registrar = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;

        // Verificar si el email ya existe
        const usuarioExistente = await Usuario.findByEmail(email);
        if (usuarioExistente) {
            return res.status(400).json({ msg: 'El email ya está registrado' });
        }

        const nuevoUsuario = await Usuario.crear(nombre, email, password, rol);
        res.status(201).json({ msg: 'Usuario creado', usuario: nuevoUsuario });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar usuario
        const usuario = await Usuario.findByEmail(email);
        if (!usuario) {
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }

        // Verificar contraseña
        const esValido = await Usuario.validarPassword(password, usuario.password);
        if (!esValido) {
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }

        // Generar token JWT
        const token = jwt.sign(
            { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            msg: 'Login exitoso',
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};