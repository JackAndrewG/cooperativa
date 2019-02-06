var express = require('express');
var router = express.Router();
var passport = require('passport');

<<<<<<< HEAD

var ruta = require('../controladores/rutaControlador');
var rutaControlador = new ruta();

var unidad = require('../controladores/unidadesControlador');
var unidadesControlador = new unidad();

=======
//var unidades = require('../controladores/unidadesController');
//var unidadesController = new unidades();
>>>>>>> 087074755897804b5b95d774f9079d8cefe6a9fe
//solo dejara ver la diferentes secciones si ha iniciado sesion
var auth = function middleWare(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash('err_cred', 'Inicia sesion!!!');
        res.redirect('/inicio_sesion');
    }
}

/* Obtener Pagina Principal. */
// presenta plantilla segun esta iniciada la sesion o no
router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) {
          res.redirect('/inicio');
      } else {
          res.render('fragmentos/frmInicio', {
            titulo: 'TransNIC Cooperativa',
            session: req.isAuthenticated()
          });
      }
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
      titulo: 'Inicio de Sesion',
      error: req.flash("err_cred")
  });
});

// Registrar nuevo usuario



router.post('/registro/guardar',
        passport.authenticate('local-signup', {successRedirect: '/inicio_sesion',
            failureRedirect: '/registro', failureFlash: true}
        ));
// registrar un nuevo bus
//router.post('/administrador/buses/guardar', auth, UnidadesController.guardar);

// Obtener Registro de Usuario

/*RUTAS ADMINISTRADOR*/
/* Obtener Destinos */
<<<<<<< HEAD

router.get('/destinos', auth, rutaControlador.verRutas);


/*router.get('/destinos', auth, function(req, res, next) {
    //if (req.user.rol === "administrador") {} <- utilizar


 res.render('fragmentos/vistaAdmin/frmDestino', { titulo: 'Administrar Destinos',
 session: req.isAuthenticated()});
}); */
/* Obtener Buses */
router.get('/administrador/buses', auth, unidadesControlador.verBuses);
=======
router.get('/administrador/destinos', auth, function(req, res, next) {
 res.render('fragmentos/vistaAdmin/frmEditar', { titulo: 'Administrar Destinos'});
});
/* Obtener Buses */
/*
router.get('/administrador/buses', auth, function(req, res, next) {
 res.render('fragmentos/vistaAdmin/frmBus', { titulo: 'Administrar Unidades de Transporte'});
});
>>>>>>> 087074755897804b5b95d774f9079d8cefe6a9fe

*/

router.get('/administrador/buses', auth, function(req, res, next) {
     res.render('fragmentos/vistaAdmin/frmBus', { titulo: 'Administrar Unidades de Transporte'});
    });

/*
router.get('/usuario/busesi', auth, function(req, res, next) {
   res.render('fragmentos/vistaUsuario/frmVistaUnidades', { titulo: 'Administrar Unidades de Transporte'});
  });
*/



/*RUTAS USUARIO*/
/* Obtener Destinos */
/*
router.get('/destinos', auth, function(req, res, next) {
 res.render('fragmentos/vistaUsuario/frmDestino', { titulo: 'Destinos de Viaje'});
}); */
/* Obtener Contactenos */
router.get('/contactenos', auth, function(req, res, next) {
 res.render('fragmentos/vistaUsuario/frmContactenos', { titulo: 'Contactenos',
session: req.isAuthenticated()});
});
/* Obtener Compra */
router.get('/comprar', auth, function(req, res, next) {
 res.render('fragmentos/vistaUsuario/frmCompra', { titulo: 'Compra de Boletos'});
});

//probando atom master

//para iniciar Sesion
router.post('/inicio_sesion/iniciar',
        passport.authenticate('local-signin',
                {successRedirect: '/inicio',
                    failureRedirect: '/inicio_sesion',
                    failureFlash: true}
        ));

//en caso de que ya haya iniciado sesion presentará una nueva vista
router.get('/inicio', auth, function(req, res, next) {
         res.render('fragmentos/plantilla_sesion_iniciada', {
           titulo: 'Bienvenido',
           usuario: req.user.nombre,
           session: req.isAuthenticated()
         });
        });

//cerrar sesion
router.get('/cerrar_sesion', function(req, res, next){
  req.session.destroy();
  res.redirect('/');
});

//registro de frecuencias
router.post('/guardar_destino', auth, rutaControlador.guardar);

//registro de buses
router.post('/guardar_bus', auth, unidadesControlador.guardar);




module.exports = router;
