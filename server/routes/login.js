const express = require('express');
const Usuario = require('../models/usuario')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

        let token = jwt.sign({ //generar el token
            usuario: userFound
        }, process.env.VERIFY_SIGNATURE, { expiresIn: process.env.LIFE_TOKEN });

        return res.json({
            status: 'succes',
            userFound,
            token,
        });

    });

})

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true,
    }

}



app.post('/google', async (req, res) => {

    let token = req.body.idtoken;

    let userGoogle = await verify(token)
        .catch(e => {
            return res.status(403).json({
                status: false,
                error: e,
            })
        })


    Usuario.findOne({ email: userGoogle.email }, (err, userFound) => {

        if (err) {
            return res.status(500).json({
                status: 'failed',
                err,
            });
        }

        if (userFound) {

            if (userFound.google === false) {

                return res.status(404).json({
                    status: 'failed',
                    err: 'Debe usar su autenticación normal'
                });
            } else {

                let token = jwt.sign({
                    usuario: userFound
                }, process.env.VERIFY_SIGNATURE, { expiresIn: process.env.LIFE_TOKEN });

                return res.json({
                    status: 'prueba',
                    usuario: userFound,
                    token,
                });
            }

        } else {

            let usuario = new Usuario();

            usuario.nombre = userGoogle.nombre;
            usuario.email = userGoogle.email;
            usuario.img = userGoogle.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, userSaved) => {

                if (err) {

                    return res.status(500).json({
                        status: false,
                        err,
                    });
                }

                let token = jwt.sign({
                    usuario: userSaved
                }, process.env.VERIFY_SIGNATURE, { expiresIn: process.env.LIFE_TOKEN });

                return res.json({
                    status: 'ok',
                    usuario: userSaved,
                    token,
                });
            });
        }
    });

});


module.exports = app;