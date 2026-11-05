
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

    const emailNormalizado = email.trim().toLowerCase(); //normalizamos el email para que quede en minuscula y sin espacios

    const usuario = usuarios.find( //buscamos el usuario 
    usuario => usuario.email === emailNormalizado
    );


        if (!usuario) {
            return res.status(401).json({
                mensaje: 'Email o contraseña incorrectos'
            });
        }

        const passwordValida = await bcrypt.compare( //compara la contraseña introducida por el usuario con hash almacenado
            password,
            usuario.password
        );

        if (!passwordValida) { //si la contraseña es incorrecta
            return res.status(401).json({
                mensaje: 'Email o contraseña incorrectos'
            });
        }

        const token = jwt.sign( //creamos el token con el id y el email 
            {
                id: usuario.id,
                email: usuario.email
            },
            process.env.JWT_SECRET, //la clave secreta para generar el token
            { expiresIn: '2h' } //el token expira en 2 horas
        );

        return res.status(200).json({ //devolvemos el token y el usuario
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
