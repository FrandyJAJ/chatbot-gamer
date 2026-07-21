function verificarAdmin(req, res, next) {

    if (!req.usuario) {
        return res.status(401).json({
            mensaje: 'Usuario no autenticado'
        });
    }

    if (req.usuario.rol !== 'ADMIN') {
        return res.status(403).json({
            mensaje: 'Acceso exclusivo para administradores'
        });
    }

    // Esta línea también es indispensable
    console.log('Verificando administrador:', req.usuario);
    next();
}

module.exports = verificarAdmin;