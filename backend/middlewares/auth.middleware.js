
const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) { 
        return res.status(401).json({
            mensaje: 'Token no proporcionado'
        });
    }

    const token = authHeader.split(' ')[1]; //obtiene el token del encabezado Authorization: Bearer

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); //verifica que el token sea válido usando la clave secreta (process.env.JWT_SECRET)

        req.usuario = decoded; //guardamos el usuario en el request

        next(); //pasamos a la siguiente función 
    } catch (error) {
        return res.status(401).json({
            mensaje: 'Token inválido o vencido'
        });
    }
}

module.exports = { verificarToken };
