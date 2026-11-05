
const usuarios = require('../data/usuarios');
const bcrypt = require('bcryptjs');

async function registrarUsuario(req, res) { //registro de usuario
    try {
        const { nombre, email, password } = req.body; //obtenemos los datos del body

    if (!nombre || !email || !password) { //si alguno de los campos esta vacio
    return res.status(400).json({
        mensaje: 'Todos los campos son obligatorios'
    });
    }

const emailNormalizado = email.trim().toLowerCase(); //trim quita los espacios en blanco al principio y al final,
                                                    //toLowerCase pasa todo a minuscula

        const emailExiste = usuarios.some( //comprueba si ya existe un usuario cuyo email coincide con el email normalizado
        usuario => usuario.email === emailNormalizado
        );

        if (emailExiste) {
            return res.status(409).json({
                mensaje: 'El email ya está registrado'
            });
        }

        const passwordHash = await bcrypt.hash(password, 10); //encriptamos la contraseña con bcrypt

        const nuevoUsuario = { //creamos el nuevo usuario con `id`, `nombre`, `email` y `password`
            id: usuarios.length + 1,
            nombre,
            email: emailNormalizado, //emailNormalizado para que quede en minuscula y sin espacios
            password: passwordHash //guarda el hash en lugar de la contraseña original
        };

        usuarios.push(nuevoUsuario); //agregamos el nuevo usuario

        return res.status(201).json({
            mensaje: 'Usuario registrado correctamente',
            usuario: {
                id: nuevoUsuario.id,
                nombre: nuevoUsuario.nombre,
                email: nuevoUsuario.email
                //no devolvemos la contraseña
            }
        });
    } catch (error) {
        return res.status(500).json({
            mensaje: 'Error al registrar el usuario'
        });
    }
}

module.exports = { registrarUsuario };
