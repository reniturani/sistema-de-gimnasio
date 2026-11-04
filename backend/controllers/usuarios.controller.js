
const usuarios = require('../data/usuarios');
const bcrypt = require('bcryptjs');

// expresion para validar que el email tenga formato de correo real
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function registrarUsuario(req, res) { //registro de usuario
    try {
        const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
    return res.status(400).json({
        mensaje: 'Todos los campos son obligatorios'
    });
    }

const nombreLimpio = nombre.trim();
const emailNormalizado = email.trim().toLowerCase();

if (nombreLimpio.length === 0) {
            return res.status(400).json({
                mensaje: 'El nombre no puede estar vacío'
            });
        }

        if (!EMAIL_REGEX.test(emailNormalizado)) {
            return res.status(400).json({
                mensaje: 'El formato del email no es válido'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                mensaje: 'La contraseña debe tener al menos 6 caracteres'
            });
        }

        const emailExiste = usuarios.some(
        usuario => usuario.email === emailNormalizado
        );

        if (emailExiste) {
            return res.status(409).json({
                mensaje: 'El email ya está registrado'
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const nuevoUsuario = {
            id: usuarios.length + 1,
            nombre: nombreLimpio,
            email: emailNormalizado,
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

module.exports = { registrarUsuario };
