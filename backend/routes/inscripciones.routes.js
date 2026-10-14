
const express = require('express');
const router = express.Router();

const {
    inscribirse
} = require('../controllers/inscripciones.controller');

router.post('/', inscribirse);

module.exports = router;
