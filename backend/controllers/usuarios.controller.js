
const usuarios = require('../data/usuarios');
const bcrypt = require('bcryptjs');

async function registrarUsuario(req, res) { //registro de usuario
    try {
        const { nombre, email, password } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios'
            });
        }

        const emailExiste = usuarios.some(
            usuario => usuario.email === email
        );

        if (emailExiste) {
            return res.status(409).json({
                mensaje: 'El email ya está registrado'
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const nuevoUsuario = {
            id: usuarios.length + 1,
            nombre,
            email,
            password: passwordHash
        };

        usuarios.push(nuevoUsuario);

        return res.status(201).json({
            mensaje: 'Usuario registrado correctamente',
            usuario: {
                id: nuevoUsuario.id,
                nombre: nuevoUsuario.nombre,
                email: nuevoUsuario.email
            }
        });
    } catch (error) {
        return res.status(500).json({
            mensaje: 'Error al registrar el usuario'
        });
    }
}

async function iniciarSesion(req, res) { //inicio de sesion
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

        return res.status(200).json({
            mensaje: 'Inicio de sesión exitoso',
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email
            }
        });
    } catch (error) {
        return res.status(500).json({
            mensaje: 'Error al iniciar sesión'
        });
    }
}

module.exports = { registrarUsuario, iniciarSesion };
