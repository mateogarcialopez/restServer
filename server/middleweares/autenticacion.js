'use strict'
const jwt = require('jsonwebtoken');

let verificarToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.VERIFY_SIGNATURE, (err, decode) => {

        if (err) {
            return res.status(401).json({
                status: 'failed',
                message: 'invalid token',
            })
        }

        req.usu = decode.usuario;
        next();
    });


}


let verificaAdminRol = (req, res, next) => {

    let administrador = req.usu.role;

    if (administrador == 'ADMIN_ROLE') {

        next();
        
    } else {

        return res.status(401).json({
            status: 'failde',
            message: 'Debes ser adminidtrador para hacer este cambio',
        });
    }

}

module.exports = {
    verificarToken,
    verificaAdminRol,
}