'use strict';
var mongoose =require('mongoose');
var Schema = mongoose.Schema;
var FrecuenciaSchema=Schema({
  id: mongoose.Schema.Types.ObjectId,
  external_id: String,
  horario: String,
  ruta: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ruta'
  },
  bus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus'
  },
  estado: {type: Boolean, default: true}
}, false);

module.exports=mongoose.model('Frecuencia', FrecuenciaSchema);
