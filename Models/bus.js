'use strict';
var mongoose =require('mongoose');
var Schema = mongoose.Schema;
var BusSchema=Schema({
  id: mongoose.Schema.Types.ObjectId,
  numeroBus: String,
  external_id: String,
  placa: String,
  propietario: String,
  numeroAsientos: Numeric,
  estado: {type: Boolean, default: true}
}, false);

module.exports=mongoose.model('Bus', BusSchema);
