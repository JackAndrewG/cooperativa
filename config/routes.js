var express = require('express');
var router = express.Router();
var passport = require('passport');
/* Obtener Pagina Principal. */
router.get('/', function(req, res, next) {
  res.render('fragmentos/frmInicio', { titulo: 'TransNIC Cooperativa'});

});

/* Obtener Registro de Usuario */
router.get('/registro', function(req, res, next) {
  res.render('fragmentos/vistaUsuario/frmRegistro', {
      titulo: 'Registro de Usuario',
      error: req.flash("correo_repetido")
  });
});

/* Obtener Login de Usuario */
router.get('/inicio_sesion', function(req, res, next) {
  res.render('fragmentos/vistaUsuario/frmLogin', {
      titulo: 'Inicio de Sesion'
  });
});

// Registrar nuevo usuario
router.post('/registro/guardar',
        passport.authenticate('local-signup', {successRedirect: '/',
            failureRedirect: '/registro', failureFlash: true}
        ));

// Obtener Registro de Usuario

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

module.exports = router;
