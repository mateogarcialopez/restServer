const express = require('express');
const Usuario = require('../models/usuario')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();



app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, userFound) => {

        if (err) {
            return res.status(500).json({
                status: 'failed',
                err,
            });
        }

        if (!userFound) {
            return res.status(400).json({
                status: 'failed',
                message: '(usuario) o contraseña incorrecto',
            });
        }

        if (!bcrypt.compareSync(body.password, userFound.password)) {

            return res.status(400).json({
                status: 'failed',
                message: 'usuario o (contraseña) incorrecto',
            });
        }

        let token = jwt.sign({
            token: userFound
        }, process.env.VERIFY_SIGNATURE, { expiresIn:process.env.LIFE_TOKEN });

        return res.json({
            status: 'succes',
            userFound,
            token,
        });

    });

})


module.exports = app;