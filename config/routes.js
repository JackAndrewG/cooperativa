var express = require('express');
var router = express.Router();
var passport = require('passport');

<<<<<<< HEAD

=======
>>>>>>> 64e0f0849801e10d629f877c735054d75a552373
var ruta = require('../controladores/rutaControlador');
var rutaControlador = new ruta();

var unidad = require('../controladores/unidadesControlador');
var unidadesControlador = new unidad();

<<<<<<< HEAD
//solo dejara ver la diferentes secciones si ha iniciado sesion
=======

//Control de Sesion
>>>>>>> 64e0f0849801e10d629f877c735054d75a552373
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

<<<<<<< HEAD
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

// Obtener Registro de Usuario

/*RUTAS ADMINISTRADOR*/
/* Obtener Destinos */

=======
/*RUTAS ADMINISTRADOR*/

/* Obtener Destinos */
>>>>>>> 64e0f0849801e10d629f877c735054d75a552373
router.get('/destinos', auth, rutaControlador.verRutas);

/*router.get('/destinos', auth, function(req, res, next) {
    //if (req.user.rol === "administrador") {} <- utilizar
 res.render('fragmentos/vistaAdmin/frmDestino', { titulo: 'Administrar Destinos',
 session: req.isAuthenticated()});
}); */

/*router.get('/destinos', auth, function(req, res, next) {
    //if (req.user.rol === "administrador") {} <- utilizar
    
    
 res.render('fragmentos/vistaAdmin/frmDestino', { titulo: 'Administrar Destinos',
 session: req.isAuthenticated()});
}); */
/* Obtener Buses */
router.get('/administrador/buses', auth, unidadesControlador.verBuses);

/*RUTAS USUARIO*/
<<<<<<< HEAD
/* Obtener Destinos */
/*
router.get('/destinos', auth, function(req, res, next) {
 res.render('fragmentos/vistaUsuario/frmDestino', { titulo: 'Destinos de Viaje'});
}); */
=======

>>>>>>> 64e0f0849801e10d629f877c735054d75a552373
/* Obtener Contactenos */
router.get('/contactenos', auth, function(req, res, next) {
 res.render('fragmentos/vistaUsuario/frmContactenos', { titulo: 'Contactenos',
session: req.isAuthenticated()});
});
/* Obtener Compra */
router.get('/comprar', auth, function(req, res, next) {
 res.render('fragmentos/vistaUsuario/frmCompra', { titulo: 'Compra de Boletos'});
});

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

<<<<<<< HEAD
=======
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

>>>>>>> 64e0f0849801e10d629f877c735054d75a552373
//cerrar sesion
router.get('/cerrar_sesion', function(req, res, next){
  req.session.destroy();
  res.redirect('/');
});

//registro de frecuencias
router.post('/guardar_destino', auth, rutaControlador.guardar);

//registro de buses
router.post('/guardar_bus', auth, unidadesControlador.guardar);


// FRECUENCIAS
//registro de frecuencias
router.post('/guardar_destino', auth, rutaControlador.guardar);


/* BUSES */
router.post('/guardar_bus', auth, unidadesControlador.guardar);
router.get('/administrador/buses', auth, unidadesControlador.verBuses);



module.exports = router;
