
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

    const usuarioExiste = usuarios.some( //buscamos si el usuario existe
        usuario => usuario.id === Number(usuarioId)
    );

    if (!usuarioExiste) { //si no existe
        return res.status(404).json({
            mensaje: 'El usuario no existe'
        });
    }

    const clase = clases.find( //buscamos la clase
        clase => clase.id === Number(claseId) //si la clase coincide con la que buscamos
    );

    if (!clase) {
        return res.status(404).json({ //si no existe
            mensaje: 'La clase no existe'
        });
    }

    const yaInscripto = inscripciones.some( //buscamos si el usuario ya esta inscripto en la clase
        inscripcion =>
            inscripcion.usuarioId === Number(usuarioId) && //si el usuario y la clase son iguales
            inscripcion.claseId === Number(claseId)
    );

    if (yaInscripto) { //si ya esta inscripto
        return res.status(409).json({
            mensaje: 'El usuario ya está inscripto en esta clase'
        });
    }

    const inscriptosEnClase = inscripciones.filter( //busca todas las inscripciones que corresponden a esa clase
        inscripcion => inscripcion.claseId === Number(claseId) //si la clase es la que buscamos
    ).length; //cuenta cuantos usuarios estan inscriptos

    if (inscriptosEnClase >= clase.cupoMaximo) { //si la cantidad de inscriptos es mayor o igual al cupo
        return res.status(409).json({
            mensaje: 'La clase no tiene cupos disponibles'
        });
    }

    const nuevaInscripcion = { //creamos la inscripcion
        id: inscripciones.length + 1, //el id es el numero de inscripciones + 1
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
        return res.status(403).json({ //usuario autenticado no tiene permiso de cancelar la inscripcion
            mensaje: 'No podés cancelar una inscripción de otro usuario'
        });
    }

    const indice = inscripciones.findIndex( //busca el indice de la inscripcion
        inscripcion => inscripcion.id === Number(id) //convierte el ID recibido en número para compararlo con el ID almacenado
    );

    inscripciones.splice(indice, 1); //elimina un elemento del arreglo desde esa posición

    return res.status(200).json({
        mensaje: 'Inscripción cancelada correctamente',
        inscripcion
    });
}
function obtenerMisInscripciones(req, res) {
    const usuarioId = req.usuario.id;

    const misInscripciones = inscripciones
        .filter(inscripcion => inscripcion.usuarioId === Number(usuarioId))
        .map(inscripcion => {
            const clase = clases.find(
                clase => clase.id === inscripcion.claseId
            );

            return {
                ...inscripcion,
                clase
            };
        });

    return res.status(200).json(misInscripciones);
}


module.exports = { inscribirse, cancelarInscripcion, obtenerMisInscripciones };
