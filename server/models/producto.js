const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let SchemaProducto = new Schema({

    nombre: {type: String, required: [true, 'El nombre es requerido']},
    precioUni: {type:Number, required:[true, 'El precio es requerido']},
    descripcion: {type: String, required: false},
    dispinible: {type:Boolean, required:true, default: true},
    categoria: {type: Schema.Types.ObjectId, ref:'categoria', required:[true, 'La categoria es requerida']},
    usuario:{type: Schema.Types.ObjectId, ref: 'usuario'},

});

module.exports = mongoose.model('producto',SchemaProducto);