import { describe, it, expect, beforeEach } from 'vitest';

require('dotenv').config();

const { iniciarSesion } = require('../../controllers/auth.controller');
const { verificarToken } = require('../../middlewares/auth.middleware');

const usuarios = require('../../data/usuarios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Preparamos los datos antes de cada prueba
beforeEach(async () => {
    usuarios.length = 0;

    const passwordHash = await bcrypt.hash('123456', 10);

    usuarios.push({
        id: 1,
        nombre: 'María',
        email: 'maria@gmail.com',
        password: passwordHash
    });
});

// Simulamos la respuesta de Express
function crearResponse() {
    return {
        statusCode: null,
        body: null,

        status(codigo) {
            this.statusCode = codigo;
            return this;
        },

        json(datos) {
            this.body = datos;
            return this;
        }
    };
}

describe('Autenticación - iniciar sesión', () => {

    // A1 - Login correcto
    it('A1 - permite iniciar sesión con credenciales correctas', async () => {
        const req = {
            body: {
                email: 'maria@gmail.com',
                password: '123456'
            }
        };

        const res = crearResponse();

        await iniciarSesion(req, res);

        expect(res.statusCode).toBe(200); //Además de que el login devuelva 200, verificamos que genere un token y devuelva los datos del usuario
        expect(res.body.mensaje).toBe('Inicio de sesión exitoso');
        expect(res.body.token).toBeDefined();
        expect(res.body.usuario.email).toBe('maria@gmail.com');
    });

    // A2 - Contraseña incorrecta
    it('A2 - rechaza una contraseña incorrecta', async () => {
        const req = {
            body: {
                email: 'maria@gmail.com',
                password: 'incorrecta'
            }
        };

        const res = crearResponse();

        await iniciarSesion(req, res);

        expect(res.statusCode).toBe(401);
        expect(res.body.mensaje).toBe('Email o contraseña incorrectos');
    });

    // A3 - Email inexistente
    it('A3 - rechaza un email que no está registrado', async () => {
        const req = {
            body: {
                email: 'desconocido@gmail.com',
                password: '123456'
            }
        };

        const res = crearResponse();

        await iniciarSesion(req, res);

        expect(res.statusCode).toBe(401);
        expect(res.body.mensaje).toBe('Email o contraseña incorrectos');
    });

    // A4 - Faltan credenciales
    it('A4 - rechaza el inicio de sesión si falta el email o la contraseña', async () => {
        const req = {
            body: {
                email: 'maria@gmail.com'
            }
        };

        const res = crearResponse();

        await iniciarSesion(req, res);

        expect(res.statusCode).toBe(400);
        expect(res.body.mensaje).toBe('El email y la contraseña son obligatorios');
    });
});
describe('Autenticación - verificar token', () => {

    // A5 - Token no proporcionado
    it('A5 - rechaza una petición sin token', () => {
        const req = {
            headers: {}
        };

        const res = crearResponse();
        const next = () => {};

        verificarToken(req, res, next);

        expect(res.statusCode).toBe(401);
        expect(res.body.mensaje).toBe('Token no proporcionado');
    });

    // A6 - Token inválido
    it('A6 - rechaza un token inválido', () => {
        const req = {
            headers: {
                authorization: 'Bearer token_invalido'
            }
        };

        const res = crearResponse();
        const next = () => {};

        verificarToken(req, res, next);

        expect(res.statusCode).toBe(401);
        expect(res.body.mensaje).toBe('Token inválido o vencido');
    });

    // A7 - Token válido
    it('A7 - permite continuar cuando el token es válido', () => {
        const token = jwt.sign(
            {
                id: 1,
                email: 'maria@gmail.com'
            },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        const req = {
            headers: {
                authorization: `Bearer ${token}`
            }
        };

        const res = crearResponse();
        let nextEjecutado = false;

        const next = () => {
            nextEjecutado = true;
        };

        verificarToken(req, res, next);

        expect(nextEjecutado).toBe(true);
        expect(req.usuario.id).toBe(1);
        expect(req.usuario.email).toBe('maria@gmail.com');
    });
});