const express = require('express');
const router = express.Router();
const { calcularCuota } = require('../controllers/cuotas.controller');

// definimos la ruta post para calcular la cuota
// la dejo publica (sin middleware de token) porque es solo una calculadora para consultar precios
router.post('/calcular', calcularCuota);

module.exports = router;