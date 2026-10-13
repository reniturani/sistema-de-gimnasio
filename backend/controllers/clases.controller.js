const clases = require('../data/clases');

function obtenerClases(req, res) {
    res.json(clases);
}

module.exports = { obtenerClases };
const express = require('express');
const router = express.Router();

const { obtenerClases } = require('../controllers/clases.controller');

router.get('/', obtenerClases);

module.exports = router;