
const inscripciones = require('../data/inscripciones');
const usuarios = require('../data/usuarios');
const clases = require('../data/clases');

function inscribirse(req, res) {
    const { usuarioId, claseId } = req.body;

    if (!usuarioId || !claseId) {
        return res.status(400).json({
            mensaje: 'El usuarioId y el claseId son obligatorios'
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

module.exports = { inscribirse };
