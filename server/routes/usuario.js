'use strict'

const Usuario = require('../models/usuario')
const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const app = express();

app.get('/getUser', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({}, 'role estado google nombre email')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    status: false,
                    err,
                });
            }

            Usuario.count({}, (err, conteo) => {

                res.json({

                    status: 'success',
                    usuarios,
                    conteo: conteo,

                });

            })
        })

})

app.post('/saveUser', (req, res) => {

    var body = req.body;


    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
    });

    usuario.save((err, userDB) => {

        if (err) {
            return res.status(400).json({
                status: false,
                err,
            });
        }


        res.json({
            status: 'success',
            user: userDB,
        })

    });
});

app.delete('/delete', (req, res) => {
    res.send('delete');
})

app.put('/updateUser/:id', (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'tole', 'estado']); //filtra los campos que quiero del objeto


    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userFound) => {

        if (err) {
            return res.status(400).json({

                status: 'failed',
                err,
            });
        }

        if (!res) {
            return res.status(400).json({

                status: 'failed',
                err,
            });

        }

        res.json({
            status: 'success',
            usuario: userFound,
        });
    });

});

module.exports = app;