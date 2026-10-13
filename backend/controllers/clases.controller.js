const clases = require('../data/clases');

function obtenerClases(req, res) {
    res.json(clases);
}

module.exports = { obtenerClases };