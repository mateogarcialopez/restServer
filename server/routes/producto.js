const express = require('express');
const SchemaProducto = require('../models/producto');
const { verificarToken } = require('../middleweares/autenticacion');

const app = express();

//crear producto
app.post('/addProducto', verificarToken, async (req, res) => {



    try {

        let datosProducto = new SchemaProducto({

            nombre: req.body.nombre,
            precioUni: req.body.precioUni,
            descripcion: req.body.descripcion,
            //disponible: req.body.disponible,
            categoria: req.body.categoria,
            usuario: req.usu._id,
        });

        let productoAgregar = await datosProducto.save();

        if (!productoAgregar) {
            return res.status(500).json({
                status: 'failed',
            });
        }
        if (productoAgregar) {
            return res.status(201).json({
                status: 'success',
                productoAgregar,
            });
        }

    } catch (error) {

        return res.status(400).json({
            status: 'failed',
            error
        });
    }


});


//actualizar producto
app.put('/updateProducto/:id', verificarToken, async (req, res) => {

    let id = req.params.id;

    try {

        let productoActualizar = {

            nombre: req.body.nombre,
            precioUni: req.body.precioUni,
            descripcion: req.body.descripcion,
            categoria: req.body.categoria,
        }

        const producoUpdated = await SchemaProducto.findByIdAndUpdate(id, productoActualizar, { new: true, runValidators: true });

        if (!producoUpdated) {
            return res.status(404).json({

                status: 'failed',
                message: 'No se encontro un producto a actualizar',
            });
        }

        if (producoUpdated) {

            return res.json({

                status: 'success',
                producoUpdated
            })
        }
    } catch (error) {

        return res.status(500).json({

            status: 'failed',
            message: 'No se encontro un producto a actualizar',
        });

    }
});


//listar productos
app.get('/getProductos', verificarToken, async (req, res) => {


    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    try {
        let productosListar = await SchemaProducto.find({ dispinible: true })
            .skip(desde)
            .limit(5)
            .sort('nombre')
            .populate('usuario', 'nombre email')
            .populate('categoria', 'descripcion');

        if (!productosListar) {
            return res.status(404).json({

                status: 'failed',
                message: 'No se encontro ninguna producto',
            });
        }
        if (productosListar) {
            return res.status(200).json({

                status: 'success',
                productosListar
            });
        }
    } catch (error) {

        return res.status(500).json({

            status: 'failed',
            error,
        });

    }
});


//listar producto
app.get('/getProducto/:id', verificarToken, async (req, res) => {

    let { id } = req.params

    try {

        let productoListar = await SchemaProducto.findById(id)
            .populate('usuario', 'nombre email')
            .populate('categoria', 'descripcion');

        if (!productoListar) {
            return res.status(400).json({
                status: 'failed',
                message: 'No se encontro el producto',
            })
        }

        if (productoListar) {
            return res.status(200).json({
                status: 'success',
                productoListar,
            })
        }

    } catch (error) {
        return res.status(400).json({
            status: 'failed',
            error
        });
    }
});


//buscar producto
app.get('/buscarProducto/:terminoBuscar', verificarToken, async (req, res) => {

    let {terminoBuscar} = req.params;
    let regex = new RegExp(terminoBuscar, 'i');

    try {

        let patron = await SchemaProducto.find({nombre: regex})
            .populate('categoria', 'nombre');

            if (!patron) {
                return res.json({
                    status: 'failed',
                    message: 'no se encontro patron',
                });
            }

        if (patron) {
            return res.json({
                status: 'success',
                patron
            });
        }

    } catch (error) {

        return res.status(400).json({
            status: 'failed',
            error
        });
    }
});

//eliminar producto
app.delete('/deleteProducto/:id', verificarToken, async (req, res) => {

    let { id } = req.params;

    try {


        const productoFinded = await SchemaProducto.findByIdAndUpdate(id, { dispinible: false }, { new: true, runValidators: true });

        if (!productoFinded) {
            return res.status(404).json({
                status: 'failed',
                message: 'No se encontro el producto',
            })
        }

        if (productoFinded) {
            return res.status(200).json({
                status: 'success',
                productoFinded,
            })
        }

    } catch (error) {

        return res.status(400).json({
            status: 'failed',
            error
        });
    }
});

module.exports = app;
