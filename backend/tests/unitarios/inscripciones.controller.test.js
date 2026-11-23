
import { describe, it, expect, beforeEach } from 'vitest';

const {
    inscribirse,
    cancelarInscripcion
} = require('../../controllers/inscripciones.controller');

const inscripciones = require('../../data/inscripciones');
const usuarios = require('../../data/usuarios');
const clases = require('../../data/clases');

// Preparamos los datos antes de cada prueba
beforeEach(() => {
    inscripciones.length = 0;
    usuarios.length = 0;

    usuarios.push(
        { id: 1, nombre: 'María', email: 'maria@gmail.com' },
        { id: 2, nombre: 'Juan', email: 'juan@gmail.com' }
    );
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

describe('Inscripciones', () => {

    // I1 - Inscripción correcta
    it('I1 - permite inscribir un usuario en una clase existente', () => {
        const req = {
            usuario: { id: 1 },
            body: { claseId: 1 }
        };

        const res = crearResponse();

        inscribirse(req, res);

        expect(res.statusCode).toBe(201);
        expect(res.body.mensaje).toBe('Inscripción realizada correctamente');
        expect(inscripciones).toHaveLength(1);
    });

    // I2 - Clase inexistente
    it('I2 - rechaza la inscripción en una clase inexistente', () => {
        const req = {
            usuario: { id: 1 },
            body: { claseId: 99 }
        };

        const res = crearResponse();

        inscribirse(req, res);

        expect(res.statusCode).toBe(404);
        expect(res.body.mensaje).toBe('La clase no existe');
        expect(inscripciones).toHaveLength(0);
    });

    // I3 - ID de clase inválido
    it('I3 - rechaza un ID de clase inválido', () => {
        const req = {
            usuario: { id: 1 },
            body: { claseId: 'abc' }
        };

        const res = crearResponse();

        inscribirse(req, res);

        expect(res.statusCode).toBe(400);
        expect(res.body.mensaje).toBe('El claseId debe ser un número entero positivo');
        expect(inscripciones).toHaveLength(0);
    });

    // I4 - Inscripción duplicada
    it('I4 - impide que un usuario se inscriba dos veces en la misma clase', () => {
        const req = {
            usuario: { id: 1 },
            body: { claseId: 1 }
        };

        const res1 = crearResponse();
        inscribirse(req, res1);

        const res2 = crearResponse();
        inscribirse(req, res2);

        expect(res1.statusCode).toBe(201);
        expect(res2.statusCode).toBe(409);
        expect(res2.body.mensaje).toBe('El usuario ya está inscripto en esta clase');
        expect(inscripciones).toHaveLength(1);
    });

    // I5 - Clase sin cupos
    it('I5 - rechaza la inscripción cuando la clase no tiene cupos', () => {
        const clase = clases.find(clase => clase.id === 1);

        // Ocupamos todos los cupos de Yoga manualmente para comprobar que el controlador rechace una inscripción adicional
        for (let i = 0; i < clase.cupoMaximo; i++) {
            inscripciones.push({
                id: i + 1,
                usuarioId: 100 + i,
                claseId: 1
            });
        }

        const req = {
            usuario: { id: 1 },
            body: { claseId: 1 }
        };

        const res = crearResponse();

        inscribirse(req, res);

        expect(res.statusCode).toBe(409);
        expect(res.body.mensaje).toBe('La clase no tiene cupos disponibles');
        expect(inscripciones).toHaveLength(clase.cupoMaximo);
    });

    // I6 - Cancelación correcta
    it('I6 - permite cancelar una inscripción propia', () => {
        inscripciones.push({
            id: 1,
            usuarioId: 1,
            claseId: 1
        });

        const req = {
            usuario: { id: 1 },
            params: { id: 1 }
        };

        const res = crearResponse();

        cancelarInscripcion(req, res);

        expect(res.statusCode).toBe(200);
        expect(res.body.mensaje).toBe('Inscripción cancelada correctamente');
        expect(inscripciones).toHaveLength(0);
    });

    // I7 - Cancelación inexistente
    it('I7 - rechaza cancelar una inscripción inexistente', () => {
        const req = {
            usuario: { id: 1 },
            params: { id: 99 }
        };

        const res = crearResponse();

        cancelarInscripcion(req, res);

        expect(res.statusCode).toBe(404);
        expect(res.body.mensaje).toBe('La inscripción no existe');
        expect(inscripciones).toHaveLength(0);
    });

    // I8 - Cancelar inscripción de otro usuario
    it('I8 - impide cancelar una inscripción de otro usuario', () => {
        inscripciones.push({
            id: 1,
            usuarioId: 2,
            claseId: 1
        });

        const req = {
            usuario: { id: 1 },
            params: { id: 1 }
        };

        const res = crearResponse();

        cancelarInscripcion(req, res);

        expect(res.statusCode).toBe(403);
        expect(res.body.mensaje).toBe('No podés cancelar una inscripción de otro usuario');
        expect(inscripciones).toHaveLength(1);
    });

});
