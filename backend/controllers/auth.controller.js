
const usuarios = require('../data/usuarios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function iniciarSesion(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                mensaje: 'El email y la contraseña son obligatorios'
            });
        }

        const usuario = usuarios.find(
            usuario => usuario.email === email
        );

        if (!usuario) {
            return res.status(401).json({
                mensaje: 'Email o contraseña incorrectos'
            });
        }

        const passwordValida = await bcrypt.compare(
            password,
            usuario.password
        );

        if (!passwordValida) {
            return res.status(401).json({
                mensaje: 'Email o contraseña incorrectos'
            });
        }

        const token = jwt.sign(
            {
                id: usuario.id,
                email: usuario.email
            },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        return res.status(200).json({
            mensaje: 'Inicio de sesión exitoso',
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email
            }
        });
    } catch (error) {
        console.error('Error en iniciarSesion:', error);

        return res.status(500).json({
            mensaje: 'Error al iniciar sesión'
        });
    }
}

module.exports = { iniciarSesion };
