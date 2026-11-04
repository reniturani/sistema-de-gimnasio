// estandar - sin descuento
class PlanEstandar {
    calcular(precioBase) {
        return precioBase;
    }
}

// plan estudiantil - 10% de descuento
class PlanEstudiante {
    calcular(precioBase) {
        return precioBase * 0.90; 
    }
}

// plan familiar - 30% de descuento
class PlanFamiliar {
    calcular(precioBase) {
        return precioBase * 0.70;
    }
}

// plan jubilados - 15% de descuento 
class PlanJubilado {
    calcular(precioBase) {
        return precioBase * 0.85;
    }
}

function obtenerEstrategiaPlan(tipoPlan) {
    const estrategias = {
        'estandar': new PlanEstandar(),
        'estudiante': new PlanEstudiante(),
        'familiar': new PlanFamiliar(),
        'jubilado': new PlanJubilado()
    };

    return estrategias[tipoPlan.toLowerCase()] || new PlanEstandar();
}

module.exports = { obtenerEstrategiaPlan };