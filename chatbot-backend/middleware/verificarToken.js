const jwt = require('jsonwebtoken');

const CLAVE_JWT = process.env.JWT_SECRET || 'gamebot_clave_secreta_2026';

function verificarToken(req, res, next) {
    const authorization = req.headers.authorization;

    console.log('Authorization recibido:', authorization);

    if (!authorization) {
        return res.status(401).json({
            mensaje: 'No se proporcionó el token'
        });
    }

    const partes = authorization.split(' ');

    if (
        partes.length !== 2 ||
        partes[0] !== 'Bearer' ||
        !partes[1]
    ) {
        return res.status(401).json({
            mensaje: 'El formato del token es incorrecto'
        });
    }

    const token = partes[1];

    try {
        const datosToken = jwt.verify(token, CLAVE_JWT);

        console.log('Token verificado:', datosToken);

        req.usuario = datosToken;
        next();

    } catch (error) {
        console.error('Error verificando token:', error.message);

        return res.status(401).json({
            mensaje: 'Token inválido o vencido',
            detalle: error.message
        });
    }
}

module.exports = verificarToken;