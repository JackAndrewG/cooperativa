/* var express = require('express');
var router = express.Router();
//GET home page. 
router.get('/', function(req, res, next) {
  res.render('fragmentos/frmInicio', { titulo: 'TransNIC Cooperativa'});
});

<<<<<<< HEAD
// Obtener Registro de Usuario 
=======
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
/* Obtener Destinos */
router.get('/destinos', function(req, res, next) {
  res.render('fragmentos/vistaUsuario/frmDestino', { titulo: 'Destinos de Viaje'});
});
/* Obtener Contactenos */
router.get('/contactenos', function(req, res, next) {
  res.render('fragmentos/vistaUsuario/frmContactenos', { titulo: 'Contactenos'});
});
/* Obtener Compra */
router.get('/comprar', function(req, res, next) {
  res.render('fragmentos/vistaUsuario/frmCompra', { titulo: 'Compra de Boletos'});
});
/* Obtener Registro */
>>>>>>> b08383c7d130c8b901732f63b4a4cd82c36ccefb
router.get('/registro', function(req, res, next) {
  res.render('fragmentos/frmRegistro', { titulo: 'Registro de Usuario'});
});
module.exports = router; 
        */
