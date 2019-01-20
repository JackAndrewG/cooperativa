'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CuentaSchema = Schema({
    id: mongoose.Schema.Types.ObjectId,
    external_id: String,
    estado: {type: Boolean, default: true},
    correo: String,
    clave: String,
    persona: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Persona"
    }
}, false);

module.exports = mongoose.model("Cuenta", CuentaSchema);
