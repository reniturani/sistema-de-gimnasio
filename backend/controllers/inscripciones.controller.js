
const inscripciones = require('../data/inscripciones');
const usuarios = require('../data/usuarios');
const clases = require('../data/clases');

function inscribirse(req, res) {
const usuarioId = req.usuario.id;
const { claseId } = req.body;

    if (!Number.isInteger(Number(claseId)) || Number(claseId) <= 0) {
    return res.status(400).json({
        mensaje: 'El claseId debe ser un número entero positivo'
    });
}

    const usuarioExiste = usuarios.some(
        usuario => usuario.id === Number(usuarioId)
    );

    if (!usuarioExiste) {
        return res.status(404).json({
            mensaje: 'El usuario no existe'
        });
    }

    const clase = clases.find(
        clase => clase.id === Number(claseId)
    );

    if (!clase) {
        return res.status(404).json({
            mensaje: 'La clase no existe'
        });
    }

    const yaInscripto = inscripciones.some(
        inscripcion =>
            inscripcion.usuarioId === Number(usuarioId) &&
            inscripcion.claseId === Number(claseId)
    );

    if (yaInscripto) {
        return res.status(409).json({
            mensaje: 'El usuario ya está inscripto en esta clase'
        });
    }

    const inscriptosEnClase = inscripciones.filter(
        inscripcion => inscripcion.claseId === Number(claseId)
    ).length;

    if (inscriptosEnClase >= clase.cupoMaximo) {
        return res.status(409).json({
            mensaje: 'La clase no tiene cupos disponibles'
        });
    }

    const nuevaInscripcion = {
        id: inscripciones.length + 1,
        usuarioId: Number(usuarioId),
        claseId: Number(claseId)
    };

    inscripciones.push(nuevaInscripcion);

    return res.status(201).json({
        mensaje: 'Inscripción realizada correctamente',
        inscripcion: nuevaInscripcion
    });
}


function cancelarInscripcion(req, res) {
    const { id } = req.params;

    const inscripcion = inscripciones.find(
        inscripcion => inscripcion.id === Number(id)
    );

    if (!inscripcion) {
        return res.status(404).json({
            mensaje: 'La inscripción no existe'
        });
    }

    if (inscripcion.usuarioId !== req.usuario.id) {
        return res.status(403).json({
            mensaje: 'No podés cancelar una inscripción de otro usuario'
        });
    }

    const indice = inscripciones.findIndex(
        inscripcion => inscripcion.id === Number(id)
    );

    inscripciones.splice(indice, 1);

    return res.status(200).json({
        mensaje: 'Inscripción cancelada correctamente',
        inscripcion
    });
}


module.exports = { inscribirse, cancelarInscripcion };
