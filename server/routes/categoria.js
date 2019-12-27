const express = require('express');
let { verificarToken, verificaAdminRol } = require('../middleweares/autenticacion');
let Categorias = require('../models/categoria');

let app = express();

//mostrar todas las categorias
app.get('/getCategorias', verificarToken, async (req, res) => {

    try {

        const categoriasFound = await Categorias.find({})
            .sort('descripcion')
            .populate('usuario', 'nombre email');

        return res.json({
            status: 'success',
            categorias: categoriasFound,
        });

    } catch (error) {

        return res.json({
            error: error
        });

    }


});

//mostrar una categoria por ID
app.get('/getCategoria/:id', async (req, res) => {

    let id = req.params.id;

    try {

        const categoriaFound = await Categorias.findById({ _id: id })
            .populate('usuario');

        if (!categoriaFound) {

            return res.json({

                status: 'failed',
                message: 'no hay nada',

            });
        }

        return res.json({

            status: 'success',
            categoria: categoriaFound,

        });

    } catch (error) {

        return res.json({

            status: 'failed',
            error,
        });

    }

});

//agregar una categoria
app.post('/addCategoria', verificarToken, async (req, res) => {

    let descripcion = req.body.descripcion;
    let usuarioId = req.usu._id;

    try {

        let categoriaNueva = new Categorias({

            descripcion: descripcion,
            usuario: usuarioId,
        });

        let saveCategoria = await categoriaNueva.save();

        if (!saveCategoria) {
            return res.status(400).json({

                status: 'failed',
                message: 'No se ha podido guardar la categoria',
            });
        }
        return res.json({

            status: 'success',
            saveCategoria,
        });

    } catch (error) {

        return res.json({

            status: 'faildes',
            error,
        });
    }

});

//actualizar una categoria
app.put('/updateCategoria/:id', verificarToken, async (req, res) => {

    let id = req.params.id;


    try {

        let categoriaActualizar = {
            descripcion: req.body.descripcion
        };

        let categoriaUpdated = await Categorias.findByIdAndUpdate(id, categoriaActualizar, { new: true, runValidators: true });

        if (!categoriaUpdated) {
            return res.status(400).json({

                status: 'failed',
                message: 'No se ha podido guardar la categoria',
            });
        }
        return res.json({

            status: 'success',
            categoriaUpdated,
        });

    } catch (error) {

        return res.json({

            status: 'failded',
            error,
        });
    }


});


//eliminar una categoria (solo un administrador puede eliminar categorias, y debemos pedir el token)
app.delete('/deleteCategoria/:id', [verificarToken, verificaAdminRol], async (req, res) => {

    let id = req.params.id;

    try {

        let categoriaDeleted = await Categorias.findByIdAndDelete(id);

        if (!categoriaDeleted) {

            return res.status(404).json({
                status: 'failed',
                message: 'no se encontro esa categoria',

            });
        };

        res.json({

            status: 'success',
            categoriaDeleted
        })

    } catch (error) {

        return res.status(400).json({
            status: 'failed',
            error,

        });
    }
});


module.exports = app;