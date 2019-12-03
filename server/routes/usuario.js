'use strict'

const {verificarToken, verificaAdminRol} = require('../middleweares/autenticacion');
const Usuario = require('../models/usuario')
const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const app = express();

app.get('/getUser', verificarToken, (req, res) => {

   

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({estado : true}, 'role estado google nombre email')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    status: false,
                    err,
                });
            }

            Usuario.count({estado : true}, (err, conteo) => {

                res.json({

                    status: 'success',
                    usuarios,
                    conteo: conteo,                   

                });

            })
        });

})

app.post('/saveUser', [verificarToken, verificaAdminRol], (req, res) => {

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

app.put('/updateUser/:id', [verificarToken, verificaAdminRol], (req, res) => {

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

app.delete('/deleteUser/:id', [verificarToken, verificaAdminRol],  (req, res) => {

    let id = req.params.id;

    Usuario.findByIdAndDelete(id, (err, userDeleted) => {

        if (err) {
            return res.status(400).json({
                status: 'failed',
            });
        }

        if (!userDeleted) {
            return res.status(400).json({
                status: 'failed',
                err: {
                    message: 'usuario no encontrado',
                },
            });
        }

        return res.json({
            status: 'success',
            userDeleted,
        });
    });



})

app.delete('/desactivateUser/:id', [verificarToken, verificaAdminRol],  (req, res) => {

    let id = req.params.id;
    console.log(id);

    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, userDesactived) => {



        if (err) {
            return res.status(400).json({
                status: 'failed',
                err
            });
        }

        if (!userDesactived) {
            return res.status(400).json({
                status: 'failed',
                err: {
                    message: 'usuario no encontrado',
                },
            });
        }

        return res.json({
            status: 'success',
            userDesactived
        });
    });

});

module.exports = app;