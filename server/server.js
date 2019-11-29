'use strict'

require('./config/config'); //configuracion global, para el puerto de conexion - process.env.PORT
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();


//despues de usar estos dos meddlewares podemos utilizar el req.body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//rutas
app.use(require('./routes/usuario'));

//conexion a la base de datos
mongoose.connect(process.env.urlDB, { useNewUrlParser: true, useCreateIndex: true}, (err, res) => {

    if (err) throw err

    console.log('base de datos conectada');

});


app.listen(process.env.PORT, () => {
    console.log('escuchando en el puerto', process.env.PORT);
});