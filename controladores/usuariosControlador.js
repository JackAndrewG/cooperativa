'use strict';
var models = require('../models');
var Persona = models.persona;
var Cuenta = models.cuenta;
var Rol = models.rol;
const uuidv4 = require('uuid/v4');
var bCrypt = require('bcrypt-nodejs');
class usuariosControlador {
    /**
 * Presentar en la vista todos las personas almacendas en el modelo Persona
 *
 * @section Admin
 *  @type  get
 *  @param {solicitud} req
 * @url /administrarUsuarios
 * @param {respuesta} res
 */
    verUsuarios(req, res) {

        //Presentar en la vista todos las personas almacendas en el modelo Persona
        if (req.user.rol === "administrador") {
            Persona.findAll({include: [
                    {model: Rol}
                ]}).then(function (personas) {
                res.render('fragmentos/vistaAdmin/frmUsuarios',
                        {titulo: 'Administrar usuarios',
                            personas: personas,
                            roles: "admin",
                            session: req.isAuthenticated(),
                            exito: req.flash("exito")
                        });
            }).catch(function (err) {
                console.log("Error:", err);
                //req.flash('error', 'Hubo un error');
                res.redirect('/incio');
            });
        } else {
            res.redirect('/inicio');
        }

    }
/**
 * Actualizar el modelo Persona con la informacion eviada desde el formulario, tomando en cuenta el external_id
 *
 * @section Admin
 *  @type  post
 *  @param {solicitud} req
 * @url /editarUsuario
 * @param {respuesta} res
 */
    editar(req, res) {

        //Actualizar el modelo Persona con la informacion eviada desde el formulario, tomando en cuenta el external_id
        Persona.update({
            cedula: req.body.cedula,
            apellido: req.body.apellido,
            nombre: req.body.nombre,
            direccion: req.body.direccion,
            telefono: req.body.telefono,
            estado: req.body.estado,
            id_rol: req.body.rol
        }, {where: {external_id: req.body.external}}).then(function (editado, err) {
            if (editado) {
                req.flash('exito', 'DATOS MODIFICADOS CORRECTAMENTE');
                res.redirect('/administrarUsuarios');
            }
        });

    }
/**
 * Presentar los datos del modelo Persona donde el external_id sea igual al external_id de la persona que haya iniciado sesión
 *
 * @section Admin
 *  @type  get
 *  @param {solicitud} req
 * @url /modificarPerfil
 * @param {respuesta} res
 */
/**
 * Presentar los datos del modelo Persona donde el external_id sea igual al external_id de la persona que haya iniciado sesión
 *
 * @section Usuario
 *  @type  get
 *  @param {solicitud} req
 * @url /modificarPerfil
 * @param {respuesta} res
 */
    verPerfil(req, res) {

        //Presentar los datos del modelo Persona donde el external_id sea igual al external_id de la persona que haya iniciado sesión
        var external = req.user.id_persona;
        if (req.user.rol === "usuario") {
            Persona.findAll({include: [
                    {model: Cuenta}
                ], where: {external_id: external}}).then(function (persona) {
                //res.send({persona: persona});
                res.render('fragmentos/vistaUsuario/frmModificarPerfil',
                        {titulo: 'Modificar perfil personal',
                            persona: persona,
                            session: req.isAuthenticated(),
                            exito: req.flash("exito")
                        });
            });
        } else {
            Persona.findAll({include: [
                    {model: Cuenta}
                ], where: {external_id: external}}).then(function (persona) {
                //res.send({persona: persona});
                res.render('fragmentos/vistaUsuario/frmModificarPerfil',
                        {titulo: 'Modificar perfil personal',
                            persona: persona,
                            roles: "admin",
                            session: req.isAuthenticated(),
                            exito: req.flash("exito")
                        });
            });
        }

    }
/**
 * Actualizar el modelo Persona y el modelo Cuenta con la informacion eviada desde el formulario,
 *tomando en cuenta el external_id de ambos modelos
 * @section Usuario
 *  @type  post
 *  @param {solicitud} req
 * @url /modificarPerfil
 * @param {respuesta} res
 */
/**
 * Actualizar el modelo Persona y el modelo Cuenta con la informacion eviada desde el formulario,
 *tomando en cuenta el external_id de ambos modelos
 * @section Usuario
 *  @type  post
 *  @param {solicitud} req
 * @url /modificarPerfil
 * @param {respuesta} res
 */
    modificarPerfil(req, res) {
        //Actualizar el modelo Persona y el modelo Cuenta con la informacion eviada desde el formulario,
        //tomando en cuenta el external_id de ambos modelos
        Persona.update({
            cedula: req.body.cedula,
            apellido: req.body.apellidos,
            nombre: req.body.nombres,
            direccion: req.body.direccion,
            telefono: req.body.telefono
        }, {where: {external_id: req.body.externalPersona}}).then(function (actualizadaPersona, err) {
            if (actualizadaPersona) {
                Cuenta.findOne({where: {external_id: req.body.externalCuenta}}).then(function (cuenta) {
                    if (cuenta) {
                        var claveNueva = req.body.clave;
                        var clave = cuenta.clave;
                        if (claveNueva !== clave) {
                            var generateHash = function (password) {
                                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
                            };
                            clave = generateHash(claveNueva);
                        }
                        Cuenta.update({
                            usuario: req.body.correo,
                            clave: clave
                        }, {where: {external_id: req.body.externalCuenta}}).then(function (actualizadaCuenta, err) {
                            if (actualizadaCuenta) {
                                req.flash('exito', 'DATOS MODIFICADOS CORRECTAMENTE');
                                res.redirect('/modificarPerfil');
                            }
                        });
                    }
                });
            }
        });
    }

//METODO QUE GUARDA EL TOKEN UNA VES INICIADO SESION
    guardarToken(req, res) {
            var token = req.params.token;
            Cuenta.update({
                token: token
            }, {where: {external_id: req.user.id_cuenta}}).then(function (updatedToken, created) {
                if (updatedToken) {
                  console.log(updatedToken);
                }
            });
        }
//METODO QUE BUSCA EL TOKEN DE CADA USUARIO
        listaCuenta(req, res) {
                Cuenta.findAll({
                    include: [
                        {model: Persona, where: {id_rol: 2}}
                    ]
                }).then(function (cuentas, created) {
                    if (cuentas) {
                      //res.send({cuentas: cuentas});
                      res.status(200).json(cuentas);
                    }
                });
            }

}


module.exports = usuariosControlador;
