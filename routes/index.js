var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('fragmentos/frmInicio', { titulo: 'TransNIC Cooperativa'});
});

/* Obtener Destinos Admin */
router.get('/administrador/destinos', function(req, res, next) {
  res.render('fragmentos/vistaAdmin/frmDestino', { titulo: 'Administrar Destinos'});
});
/* Obtener Buses Admin */
router.get('/administrador/buses', function(req, res, next) {
  res.render('fragmentos/vistaAdmin/frmBus', { titulo: 'Administrar Unidades de Transporte'});
});

/* Obtener Registro de Usuario */
router.get('/registro', function(req, res, next) {
  res.render('fragmentos/frmRegistro', { titulo: 'Registro de Usuario'});
});
module.exports = router;
