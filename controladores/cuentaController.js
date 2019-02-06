'use strict';
class CuentaController {
    verLogin(req, res) {
        res.render('inicio_sesion', {
            fragmento: 'fragmentos/inicio_sesion/frm_login',
            titulo: 'Inicio de sesion',
            error: req.flash("err_cred")
        });
    }
    verRegistro(req, res) {
        res.render('inicio_sesion', {
            fragmento: 'fragmentos/inicio_sesion/frm_registro',
            titulo: 'Registro de usuarios',
            error: req.flash("correo_repetido")
        });
    }

    cerrar(req, res) {
        req.session.destroy();
        res.redirect("/josselyn");
    }

}
module.exports = CuentaController;

// no se utiliza


