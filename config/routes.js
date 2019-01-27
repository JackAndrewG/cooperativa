var express = require('express');
var router = express.Router();
var passport = require('passport');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('fragmentos/frmInicio', { titulo: 'TransNIC Cooperativa'});
});

/* Obtener Registro de Usuario */
router.get('/registro', function(req, res, next) {
  res.render('fragmentos/frmRegistro', {
      titulo: 'Registro de Usuario',
      error: req.flash("correo_repetido")
  });
});

// Registrar nuevo usuario
router.post('/registro/guardar',
        passport.authenticate('local-signup', {successRedirect: '/',
            failureRedirect: '/registro', failureFlash: true}
        ));


module.exports = router;


