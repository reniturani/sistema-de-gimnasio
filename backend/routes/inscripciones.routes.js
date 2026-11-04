
const express = require('express');
const router = express.Router();

const {
    inscribirse,
    cancelarInscripcion
} = require('../controllers/inscripciones.controller');

const {
    verificarToken
} = require('../middlewares/auth.middleware');

router.post('/', verificarToken, inscribirse);
router.delete('/:id', verificarToken, cancelarInscripcion);

module.exports = router;
