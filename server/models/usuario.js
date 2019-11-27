'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un valor valido',
};


let usuarioSchema = new Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre en necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        require: [true, 'la contraseña es necesario']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos,
    },
    estado: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false,
    },
});


usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} debe ser unico',
});

module.exports = mongoose.model('usuario', usuarioSchema);