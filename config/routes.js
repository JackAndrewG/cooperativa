var express = require('express');
var router = express.Router();
var passport = require('passport');
var ruta = require('../controladores/rutaControlador');
var rutaControlador = new ruta();
var unidad = require('../controladores/unidadesControlador');
var unidadesControlador = new unidad();
var compra = require('../controladores/compraControlador');
var compraControlador = new compra();
/*PAGINA PRINCIPAL*/
// presenta plantilla segun esta iniciada la sesion o no
router.get('/', function (req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/inicio');
    } else {
        res.render('fragmentos/frmInicio', {
            titulo: 'TransNIC Cooperativa',
            session: req.isAuthenticated()
        });
    }
});
//CONTROL DE SESION
var auth = function middleWare(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash('err_cred', '¡Inicia sesion!');
        res.redirect('/inicio_sesion');
    }
}


/*REGISTRO*/

/* Obtener Registro de Usuario */
router.get('/registro', function (req, res, next) {
    res.render('fragmentos/vistaUsuario/frmRegistro', {
        titulo: 'Registro de Usuario',
        error: req.flash("correo_repetido")
    });
});
// Registrar nuevo usuario
router.post('/registro/guardar',
        passport.authenticate('local-signup', {successRedirect: '/inicio_sesion',
            failureRedirect: '/registro', failureFlash: true}
        )
);
/* INICIO DE SESION */
router.get('/inicio_sesion', function (req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/inicio');
    } else {
        res.render('fragmentos/vistaUsuario/frmLogin', {
            titulo: 'Inicio de Sesion',
            error: req.flash("err_cred")
        });
    }


});
//para iniciar Sesion
router.post('/inicio_sesion/iniciar',
        passport.authenticate('local-signin',
                {successRedirect: '/inicio',
                    failureRedirect: '/inicio_sesion',
                    failureFlash: true}
        ));
//en caso de que ya haya iniciado sesion presentará una nueva vista
router.get('/inicio', auth, function (req, res, next) {
    res.render('fragmentos/plantilla_sesion_iniciada', {
        titulo: 'Bienvenido',
        usuario: req.user.nombre,
        session: req.isAuthenticated()
    });
});
//cerrar sesion
router.get('/cerrar_sesion', function (req, res, next) {
    req.session.destroy();
    res.redirect('/');
});
/*RUTAS ADMINISTRADOR*/
/* DESTINOS */
router.get('/destinos', auth, rutaControlador.verRutas);
router.post('/guardar_destino', auth, rutaControlador.guardar);
router.post('/editarDestino', auth, rutaControlador.editar);
/* BUSES */
router.get('/administrador/buses', auth, unidadesControlador.verBuses);
router.post('/guardar_bus', auth, unidadesControlador.guardar);
router.post('/editarBus', auth, unidadesControlador.editar);
/* Obtener Contactenos */
router.get('/contactenos', auth, function (req, res, next) {
    res.render('fragmentos/vistaUsuario/frmContactenos', {titulo: 'Contactenos',
        session: req.isAuthenticated()});
});
/* Obtener Compra */
router.get('/comprar', auth, compraControlador.verRutas);
router.post('/compra_buscar', auth, compraControlador.buscar);
/*RUTAS ADMINISTRADOR*/
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

/*RUTAS USUARIO*/

/* Obtener Destinos */
/*
 router.get('/destinos', auth, function(req, res, next) {
 res.render('fragmentos/vistaUsuario/frmDestino', { titulo: 'Destinos de Viaje'});
 }); */



module.exports = router;
