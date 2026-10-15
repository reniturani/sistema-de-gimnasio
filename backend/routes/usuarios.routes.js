const express = require('express');
const router = express.Router();

const {
    registrarUsuario
} = require('../controllers/usuarios.controller');

const {
    verificarToken
} = require('../middlewares/auth.middleware');

router.post('/', registrarUsuario);

router.get('/perfil', verificarToken, (req, res) => {
    res.status(200).json({
        mensaje: 'Usuario autenticado correctamente',
        usuario: req.usuario
    });
});

module.exports = router;