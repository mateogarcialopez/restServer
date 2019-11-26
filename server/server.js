'use strict'

require('./config/config'); //configuracion global, para el puerto de conexion - process.env.PORT
const express = require('express');
const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
//despues de usar estos dos meddlewares podemos utilizar el req.body

app.get('/', (req, res) => {
    res.send('probando conexion')
})

app.post('/post', (req, res) => {

    var body = req.body;

    return res.status(200).send({
        body
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

app.listen(process.env.PORT, ()=>{
    console.log('escuchando en el puerto', process.env.PORT);
});