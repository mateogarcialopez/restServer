'use strict'

const Usuario = require('../models/usuario')
const express = require('express');
const app = express();

app.get('/prueba', (req, res) => {
    res.send('probando conexion')
})

app.post('/saveUser', (req, res) => {

    var body = req.body;
   

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: body.password,
        role: body.role,
    });

    usuario.save((err, userDB)=>{

        if(err){
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

app.delete('/delete', (req, res)=>{
    res.send('delete');
})

app.put('/put/:id', (req, res)=>{
    var params = req.params;
     return res.status(200).send(
        {
            message : 'ok',
            cod: params.id,
        }
     );
});

module.exports = app;