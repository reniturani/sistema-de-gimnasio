
const express = require('express');
const router = express.Router();

const {
    inscribirse,
    cancelarInscripcion
} = require('../controllers/inscripciones.controller');

router.post('/', inscribirse);
router.delete('/:id', cancelarInscripcion);

module.exports = router;
