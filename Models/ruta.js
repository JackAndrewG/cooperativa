'use strict';
var mongoose =require('mongoose');
var Schema = mongoose.Schema;
var RutaSchema=Schema({
  id: mongoose.Schema.Types.ObjectId,
  external_id: String,
  origen: String,
  destino: String,
  valor: Numeric,
  estado: {type: Boolean, default: true}
}, false);

module.exports=mongoose.model('Ruta', RutaSchema);
