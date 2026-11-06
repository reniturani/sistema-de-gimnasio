import { describe, it, expect, beforeEach } from 'vitest';

const { registrarUsuario } = require('../../controllers/usuarios.controller');
const usuarios = require('../../data/usuarios');
const bcrypt = require('bcryptjs');

beforeEach (() => {
    usuarios.length = 0;
});

function crearResponse() {
    return {
        statusCode: null, //guarda el codigo HTTP recibido
        body: null, //guarda el cuerpo de la respuesta

        status(codigo) { //simula res.status(codigo)
            this.statusCode = codigo;
            return this;
        },

        json(datos) { //simula res.json(datos)
            this.body = datos;
            return this;
        }
    };
}

describe('Registro de usuarios', () => {

    it('U1 - registra correctamente un usuario', async () => { //test 1 - registra correctamente un usuario

        const req = { //simula los datos del request 
            body: {
                nombre: 'María',
                email: 'maria@gmail.com',
                password: '123456'
            }
        };

        const res = crearResponse(); //simula la respuesta

        await registrarUsuario(req, res);

        expect(res.statusCode).toBe(201);
        expect(res.body.mensaje).toBe('Usuario registrado correctamente');
        expect(usuarios).toHaveLength(1);

    });

});

it('U2 - no permite registrar un email duplicado', async () => { //test 2 - no permite registrar un email duplicado

    const req1 = {
        body: {
            nombre: 'María',
            email: 'maria@gmail.com',
            password: '123456'
        }
    };

    const res1 = crearResponse();

    await registrarUsuario(req1, res1);

    const req2 = {
        body: {
            nombre: 'Ana',
            email: 'maria@gmail.com',
            password: '654321'
        }
    };

    const res2 = crearResponse();

    await registrarUsuario(req2, res2);

    expect(res2.statusCode).toBe(409);
    expect(res2.body.mensaje).toBe('El email ya está registrado');
    expect(usuarios).toHaveLength(1);
});

it('U3 - no permite registrar un usuario sin nombre', async () => { // test 3 - no permite registrar un usuario sin nombre

    const req = {
        body: {
            email: 'juan@gmail.com',
            password: '123456'
        }
    };

    const res = crearResponse();

    await registrarUsuario(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body.mensaje).toBe('Todos los campos son obligatorios');
    expect(usuarios).toHaveLength(0); //no se ha creado ningun usuario porque debe rechazarse 
});


it('U4 - no permite registrar un usuario sin email', async () => { //test 4 - no permite registrar un usuario sin email

    const req = {
        body: {
            nombre: 'Juan',
            password: '123456'
        }
    };

    const res = crearResponse();

    await registrarUsuario(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body.mensaje).toBe('Todos los campos son obligatorios');
    expect(usuarios).toHaveLength(0);
});

it('U5 - no permite registrar un usuario sin contraseña', async () => { //test 5 - no permite registrar un usuario sin contraseña

    const req = {
        body: {
            nombre: 'Juan',
            email: 'juan@gmail.com'
        }
    };

    const res = crearResponse();

    await registrarUsuario(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body.mensaje).toBe('Todos los campos son obligatorios');
    expect(usuarios).toHaveLength(0);
});

it('U6 - normaliza el email antes de guardarlo', async () => { //test 6 - normaliza el email antes de guardarlo

    const req = {
        body: {
            nombre: 'Ana',
            email: '  ANA@GMAIL.COM  ',
            password: '123456'
        }
    };

    const res = crearResponse();

    await registrarUsuario(req, res);

    expect(res.statusCode).toBe(201);
    expect(usuarios[0].email).toBe('ana@gmail.com'); //accede al email del primer usuario guardado

});

it('U7 - guarda la contraseña como hash', async () => { //test 7 - guarda la contraseña como hash 

    const req = {
        body: {
            nombre: 'Pedro',
            email: 'pedro@gmail.com',
            password: '123456'
        }
    };

    const res = crearResponse();

    await registrarUsuario(req, res);

    expect(res.statusCode).toBe(201);
    expect(usuarios[0].password).not.toBe('123456');

    const passwordValida = await bcrypt.compare(
        '123456',
        usuarios[0].password
    );

    expect(passwordValida).toBe(true);

//que la contraseña almacenada sea diferente de la original.
//que bcrypt.compare() pueda verificar la contraseña original contra el hash.
//que el resultado sea true.
});

it('U8 - no devuelve la contraseña en la respuesta', async () => { //test 8 - no devuelve la contraseña en la respuesta

    const req = {
        body: {
            nombre: 'Laura',
            email: 'laura@gmail.com',
            password: '123456'
        }
    };

    const res = crearResponse();

    await registrarUsuario(req, res);

    expect(res.statusCode).toBe(201);
    expect(res.body.usuario).not.toHaveProperty('password'); //usuario se registra pero no debe aparecer la contraseña en la respuesta del servidor

});

it('U9 - permite registrar dos usuarios diferentes', async () => { //test 9 - permite registrar dos usuarios diferentes

    const req1 = {
        body: {
            nombre: 'María',
            email: 'maria@gmail.com',
            password: '123456'
        }
    };

    const res1 = crearResponse();

    await registrarUsuario(req1, res1);

    const req2 = {
        body: {
            nombre: 'Juan',
            email: 'juan@gmail.com',
            password: '654321'
        }
    };

    const res2 = crearResponse();

    await registrarUsuario(req2, res2);

    expect(res1.statusCode).toBe(201);
    expect(res2.statusCode).toBe(201);
    expect(usuarios).toHaveLength(2);

});