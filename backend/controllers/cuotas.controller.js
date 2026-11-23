const { obtenerEstrategiaPlan } = require('../strategies/planes.strategy');

function calcularCuota(req, res) {
    // el frontend va a enviar cuantos dias y que tipo de plan quiere consultar
    const { frecuencia, tipoPlan } = req.body; 

    if (!frecuencia || !tipoPlan) {
        return res.status(400).json({
            mensaje: 'Debes indicar la frecuencia (3_dias, todos_los_dias) y el tipoPlan (estandar, estudiante, familiar, jubilado)'
        });
    }

    // definimos los precios base segun la frecuencia elegida
    const PRECIOS_BASE = {
        '3_dias': 15000,
        'todos_los_dias': 20000
    };

    const precioBase = PRECIOS_BASE[frecuencia.toLowerCase()];
    
    if (!precioBase) {
        return res.status(400).json({
            mensaje: 'Frecuencia no válida. Usá "3_dias" o "todos_los_dias"'
        });
    }

    // 1. obtenemos el descuento
    const estrategia = obtenerEstrategiaPlan(tipoPlan);

    // 2. calculamos el precio final aplicando el descuento del strategy al precio base
    const precioFinal = estrategia.calcular(precioBase);

    return res.status(200).json({
        mensaje: 'Consulta de cuota exitosa',
        frecuenciaSeleccionada: frecuencia,
        planSeleccionado: tipoPlan,
        precioBase: precioBase,
        precioFinal: precioFinal
    });
}

module.exports = { calcularCuota };