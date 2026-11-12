
const clases = require('../data/clases');
const inscripciones = require('../data/inscripciones');

function obtenerClases(req, res) {
    const clasesConDisponibilidad = clases.map(clase => {
        const cantidadInscriptos = inscripciones.filter(
            inscripcion => inscripcion.claseId === clase.id
        ).length;

        return {
            ...clase,
            cantidadInscriptos,
            cuposDisponibles: clase.cupoMaximo - cantidadInscriptos
        };
    });

    res.json(clasesConDisponibilidad);
}

module.exports = { obtenerClases };
