var express = require('express');
var router = express.Router();
var passport = require('passport');

var ruta = require('../controladores/rutaControlador');
var rutaControlador = new ruta();
var unidad = require('../controladores/unidadesControlador');
var unidadesControlador = new unidad();
var compra = require('../controladores/compraControlador');
var compraControlador = new compra();
var usuario = require('../controladores/usuariosControlador');
var usuariosControlador = new usuario();
var EnviarCorreo = require('../controladores/enviarCorreo');

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
    var roles = req.user.rol;

    if (roles === "administrador") {
        res.render('fragmentos/plantilla_sesion_iniciada', {
            titulo: 'Bienvenido',
            roles: req.user.rol,
            usuario: req.user.nombre,
            session: req.isAuthenticated()
        });
    } else {
        res.render('fragmentos/plantilla_sesion_iniciada', {
            titulo: 'Bienvenido',
            usuario: req.user.nombre,
            session: req.isAuthenticated()
        });
    }

});
//cerrar sesion
router.get('/cerrar_sesion', function (req, res, next) {
    req.session.destroy();
    res.redirect('/');
});

/*RUTAS ADMINISTRADORES Y USUARIOS*/
/* TOKEN */
router.get('/guardarToken/:token', usuariosControlador.guardarToken);
/* DESTINOS */
router.get('/destinos', auth, rutaControlador.verRutas);
router.get('/destinosActivos', auth, rutaControlador.verRutasActivas);
router.post('/guardar_destino', auth, rutaControlador.guardar);
router.post('/editarDestino', auth, rutaControlador.editar);
router.post('/buscarDestino', auth, rutaControlador.buscar);

/* BUSES */
router.get('/buses', auth, unidadesControlador.verBuses);
router.get('/busesActivos', auth, unidadesControlador.verBusesActivos);
router.post('/guardar_bus', auth, unidadesControlador.guardar);
router.post('/editarBus', auth, unidadesControlador.editar);

/* COMPRAS */
router.get('/comprar', auth, compraControlador.verRutas);
router.post('/compra_buscar', auth, compraControlador.buscar);
router.post('/comprar/:idFrecuencia', compraControlador.comprar);
router.get('/frecuencia/:idFrecuencia', auth, compraControlador.mostrarPago);
router.get('/pago/tarjeta', auth, compraControlador.tarjeta);
router.get('/pago/comprobar', auth, compraControlador.comprobarPago);

/* IMPRIMIR BOLETO*/
router.get('/reporte', auth, compraControlador.verBoleto);
//router.get('/reportes', auth, compraControlador.verReporte);

/* Obtener Contactenos */
router.get('/contactenos', auth, function (req, res, next) {
    var roles = req.user.rol;
    if (roles === "administrador") {
        res.render('fragmentos/vistaUsuario/frmContactenos', {titulo: 'Contactenos',
            session: req.isAuthenticated(), info: req.flash('info_correcta'), roles: roles});
    } else {
        res.render('fragmentos/vistaUsuario/frmContactenos', {titulo: 'Contactenos',
            session: req.isAuthenticated(), info: req.flash('info_correcta')});
    }
});

/*ENVIAR CORREO ELECTRONICO*/
router.post('/contactenos', EnviarCorreo.sendEmail);

/* Administrar usuario */
router.get('/administrarUsuarios', auth, usuariosControlador.verUsuarios);
router.post('/editarUsuario', auth, usuariosControlador.editar);
router.get('/modificarPerfil', auth, usuariosControlador.verPerfil);
router.post('/modificarPerfil', usuariosControlador.modificarPerfil);


module.exports = router;
