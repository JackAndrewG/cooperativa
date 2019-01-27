var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('fragmentos/frmInicio', { titulo: 'TransNIC Cooperativa'});
});

/*RUTAS ADMINISTRADOR*/
/* Obtener Destinos */
router.get('/administrador/destinos', function(req, res, next) {
  res.render('fragmentos/vistaAdmin/frmDestino', { titulo: 'Administrar Destinos'});
});
/* Obtener Buses */
router.get('/administrador/buses', function(req, res, next) {
  res.render('fragmentos/vistaAdmin/frmBus', { titulo: 'Administrar Unidades de Transporte'});
});

/*RUTAS USUARIO*/
/* Obtener Compra */
router.get('/comprar', function(req, res, next) {
  res.render('fragmentos/vistaUsuario/frmCompra', { titulo: 'Compra de Boletos'});
});
/* Obtener Registro */
router.get('/registro', function(req, res, next) {
  res.render('fragmentos/frmRegistro', { titulo: 'Registro de Usuario'});
});
module.exports = router;
