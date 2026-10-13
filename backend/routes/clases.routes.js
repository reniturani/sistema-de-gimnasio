const express = require('express');
const router = express.Router();

const clases = [
    {
        id: 1,
        nombre: 'Yoga',
        horario: 'Lunes de 18:00 a 19:00',
        cupoMaximo: 15
    },
    {
        id: 2,
        nombre: 'CrossFit',
        horario: 'Miercoles de 08:00 a 09:00',
        cupoMaximo: 12
    }
];

router.get('/', (req, res) => {
    res.json(clases);
});

module.exports = router;