const express = require('express');
const router = express.Router();

const { obtenerClases } = require('../controllers/clases.controller');

router.get('/', obtenerClases);

module.exports = router;