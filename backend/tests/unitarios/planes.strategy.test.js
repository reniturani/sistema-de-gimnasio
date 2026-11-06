//test para estrategia de planes

import { describe, it, expect } from 'vitest';
const { obtenerEstrategiaPlan } = require('../../strategies/planes.strategy');

describe('Estrategia de planes de cuotas', () => {

    it('S1 - Plan estándar: no aplica descuento', () => { //no aplica descuento (plan estandar)
        const estrategia = obtenerEstrategiaPlan('estandar');

        expect(estrategia.calcular(15000)).toBe(15000);
    });

    it('S2 - Plan estudiante: aplica 10% de descuento', () => { //aplica descuento (plan estudiante)
        const estrategia = obtenerEstrategiaPlan('estudiante');

        expect(estrategia.calcular(15000)).toBe(13500);
    });

    it('S3 - Plan familiar: aplica 30% de descuento', () => { //aplica descuento (plan familiar)
        const estrategia = obtenerEstrategiaPlan('familiar');

        expect(estrategia.calcular(15000)).toBe(10500);
    });

    it('S4 - Plan jubilado: aplica 15% de descuento', () => { //aplica descuento (plan jubilado)
        const estrategia = obtenerEstrategiaPlan('jubilado');

        expect(estrategia.calcular(15000)).toBe(12750);
    });

    it('S5 - Plan desconocido: utiliza el plan estándar', () => { //utiliza el plan estándar
        const estrategia = obtenerEstrategiaPlan('premium');

        expect(estrategia.calcular(15000)).toBe(15000);
    });

    it('S6 - Plan en mayúsculas: reconoce el tipo de plan', () => { //reconoce el tipo de plan
        const estrategia = obtenerEstrategiaPlan('ESTUDIANTE');

        expect(estrategia.calcular(15000)).toBe(13500);
    });

});
