const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let SchemaCategoria =  new Schema({
    descripcion : {type: String, unique: true, required: [true, 'La descripcion es necesaria'] },
    usuario: {type: Schema.Types.ObjectId, ref: 'usuario'},
});

module.exports = mongoose.model('categoria', SchemaCategoria);