import { describe, it, expect } from 'vitest';

const { calcularCuota } = require('../../controllers/cuotas.controller');

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

//Precios base actuales: 3_dias = 15000 y todos_los_dias = 20000.


describe('Cálculo de cuotas', () => {

    // C1 - 3 días + estudiante
    it('C1 - calcula correctamente 3 días con plan estudiante', () => {
        const req = {
            body: {
                frecuencia: '3_dias',
                tipoPlan: 'estudiante'
            }
        };

        const res = crearResponse();

        calcularCuota(req, res);

        expect(res.statusCode).toBe(200);
        expect(res.body.precioBase).toBe(15000);
        expect(res.body.precioFinal).toBe(13500);
    });

    // C2 - Todos los días + estudiante
    it('C2 - calcula correctamente todos los días con plan estudiante', () => {
        const req = {
            body: {
                frecuencia: 'todos_los_dias',
                tipoPlan: 'estudiante'
            }
        };

        const res = crearResponse();

        calcularCuota(req, res);

        expect(res.statusCode).toBe(200);
        expect(res.body.precioBase).toBe(20000);
        expect(res.body.precioFinal).toBe(18000);
    });

    // C3 - 3 días + familiar
    it('C3 - calcula correctamente 3 días con plan familiar', () => {
        const req = {
            body: {
                frecuencia: '3_dias',
                tipoPlan: 'familiar'
            }
        };

        const res = crearResponse();

        calcularCuota(req, res);

        expect(res.statusCode).toBe(200);
        expect(res.body.precioBase).toBe(15000);
        expect(res.body.precioFinal).toBe(10500);
    });

    // C4 - Todos los días + jubilado
    it('C4 - calcula correctamente todos los días con plan jubilado', () => {
        const req = {
            body: {
                frecuencia: 'todos_los_dias',
                tipoPlan: 'jubilado'
            }
        };

        const res = crearResponse();

        calcularCuota(req, res);

        expect(res.statusCode).toBe(200);
        expect(res.body.precioBase).toBe(20000);
        expect(res.body.precioFinal).toBe(17000);
    });

    // C5 - Frecuencia inexistente
    it('C5 - rechaza una frecuencia inexistente', () => {
        const req = {
            body: {
                frecuencia: 'fines_de_semana',
                tipoPlan: 'estudiante'
            }
        };

        const res = crearResponse();

        calcularCuota(req, res);

        expect(res.statusCode).toBe(400);
        expect(res.body.mensaje).toBe(
            'Frecuencia no válida. Usá "3_dias" o "todos_los_dias"'
        );
    });

    // C6 - Falta la frecuencia
    it('C6 - rechaza el cálculo cuando falta la frecuencia', () => {
        const req = {
            body: {
                tipoPlan: 'estudiante'
            }
        };

        const res = crearResponse();

        calcularCuota(req, res);

        expect(res.statusCode).toBe(400);
        expect(res.body.mensaje).toBe(
            'Debes indicar la frecuencia (3_dias, todos_los_dias) y el tipoPlan (estandar, estudiante, familiar, jubilado)'
        );
    });

    // C7 - Falta el tipo de plan
    it('C7 - rechaza el cálculo cuando falta el tipo de plan', () => {
        const req = {
            body: {
                frecuencia: '3_dias'
            }
        };

        const res = crearResponse();

        calcularCuota(req, res);

        expect(res.statusCode).toBe(400);
        expect(res.body.mensaje).toBe(
            'Debes indicar la frecuencia (3_dias, todos_los_dias) y el tipoPlan (estandar, estudiante, familiar, jubilado)'
        );
    });

    // C8 - Plan desconocido
    it('C8 - calcula sin descuento cuando el plan es desconocido', () => {
        const req = {
            body: {
                frecuencia: '3_dias',
                tipoPlan: 'premium'
            }
        };

        const res = crearResponse();

        calcularCuota(req, res);

        expect(res.statusCode).toBe(200);
        expect(res.body.precioBase).toBe(15000);
        expect(res.body.precioFinal).toBe(15000);
    });

});
