'use strict';
var models = require('../models'); //importación de modelos
var Ruta = models.ruta;
var Frecuencia = models.frecuencia;
var Bus = models.bus;
const uuidv4 = require('uuid/v4');

class rutaControlador {
    /**
 * guardado en la base de datos de la informacion ingresada en los formularios para los modelos de Ruta y Frecuencia
 *
 * @section Admin
 *  @type  post
 *  @param {solicitud} req  modelo Bus,Frecuencia
 * @url /guardar_destino
 * @param {respuesta} res.Crecion.Frecuencia
 * @returns {object} Frcuencia creada
 */
    guardar(req, res) {
        //guardado en la base de datos de la informacion ingresada en los formularios para los modelos de Ruta y Frecuencia  
        Ruta.create({
            external_id: uuidv4(),
            origen: req.body.origen,
            destino: req.body.destino,
            valor: req.body.valor
        }).then(function (newRuta, created) {
            if (newRuta) {
                req.flash('info_correcto', 'Se ha guardado correctamente');
                Bus.findOne({where: {id: req.body.bus}}).then(function (bus) {
                    Frecuencia.create({
                        external_id: uuidv4(),
                        horario: req.body.hora_salida,
                        asientosDisponibles: bus.numeroAsientos,
                        fecha: req.body.fecha,
                        id_ruta: newRuta.id,
                        id_bus: req.body.bus
                    }).then(function (newFrecuencia, created) {
                        if (newFrecuencia) {
                            console.log("Se ha creado correctamente");
                            res.redirect('/destinosActivos');
                        }
                    });
                });

            }
        });



    }
/**
 * Actualizar los modelos de Ruta y Frecuencia con la información ingresada en los formularios según el external_id correspondiente
 *
 * @section Admin
 *  @type  post
 *  @param {solicitud} req 
 * @url /editarDestino
 * @param {respuesta} res 
 */
    editar(req, res) {

        //Actualizar los modelos de Ruta y Frecuencia con la información ingresada en los formularios según el external_id correspondiente
        Ruta.update({
            valor: req.body.valor
        }, {where: {external_id: req.body.external}}).then(function (newRuta, created) {
            if (newRuta) {
                Frecuencia.update({
                    estado: req.body.estado,
                    horario: req.body.hora_salida,
                    id_bus: req.body.bus
                }, {where: {external_id: req.body.externalFrecuencia}}).then(function (newFrecuencia, created) {
                    if (newFrecuencia) {
                        req.flash('info_correcto', 'Se ha modificado correctamente la información');
                        console.log("Se ha MODIFICADO correctamente");
                        res.redirect('/destinosActivos');
                    }
                });
            }

        });
    }
    /**
 * Editar ruta mostar las Frecuencias existentes en la Base de Datos 
 *
 * @section Admin 
 *  @type  get
 *  @param {solicitud} req 
 * @url /destinos
 * @param {respuesta} es 
 */
    verRutas(req, res) {
        
        //mostar las Frecuencias existentes en la Base de Datos 
        if (req.user.rol === "administrador") { //en el caso de ser administrador
            Bus.findAll().then(function (buses) { //buscar todos los buses
                Frecuencia.findAll({//buscar todas las frecuencias
                    include: [
                        {model: Ruta},
                        {model: Bus}
                    ]}).then(function (frecuencias) {
                    res.render('fragmentos/vistaAdmin/frmDestino', //renderizar la vista 
                            {titulo: 'Administrar Destinos',
                                frecuencias: frecuencias, //enviar frecuencias 
                                buses: buses, //y buses con el resultado de las consultas anteriores
                                roles: "admin", //identifiación del administrador
                                session: req.isAuthenticated(), //permite verificar si ha iniciado sesión
                                info: req.flash("info_correcto") //mensaje de información
                            });
                }).catch(function (err) { //en caso de error redireccionar a otra ruta
                    console.log("Error:", err);
                    //req.flash('error', 'Hubo un error');
                    res.redirect('/destinos');
                });
            });
        } else {
            //en caso de que el usuario haga uso de esta ruta será redireccionado
            res.redirect('/destinosActivos');
        }
    }
 /**
 * mostar las Frecuencias existentes en la Base de Datos, en caso de ser administrador presentará una vista diferente a la del usuario 
 *
 * @section Admin 
 *  @type  get
 *  @param {solicitud} req 
 * @url /destinosActivos
 * @param {respuesta} es 
 */
/**
 * mostar las Frecuencias existentes en la Base de Datos, en caso de ser administrador presentará una vista diferente a la del usuario 
 *
 * @section Usuario 
 *  @type  get
 *  @param {solicitud} req 
 * @url /destinosActivos
 * @param {respuesta} es 
 */
    verRutasActivas(req, res) {

        //mostar las Frecuencias existentes en la Base de Datos
        //en caso de ser administrador presentará una vista diferente a la del usuario
        if (req.user.rol === "administrador") {
            Bus.findAll({where: {estado: true}}).then(function (buses) { //buscar toda la información del modelo Bus donde el estado sea true
                Frecuencia.findAll({
                    include: [
                        {model: Ruta},
                        {model: Bus}
                    ], where: {estado: true}}).then(function (frecuencias) { //buscar frecuencias donde el estado sea true
                    res.render('fragmentos/vistaAdmin/frmDestino',
                            {titulo: 'Administrar Destinos',
                                frecuencias: frecuencias,
                                buses: buses,
                                roles: "admin",
                                session: req.isAuthenticated(),
                                info: req.flash("info_correcto")
                            });
                }).catch(function (err) {
                    console.log("Error:", err);
                    res.redirect('/destinosActivos');
                });
            });
        } else {
            Frecuencia.findAll({
                include: [
                    {model: Ruta},
                    {model: Bus}
                ], where: {estado: true}}).then(function (frecuencias) {
                res.render('fragmentos/vistaUsuario/frmDestino',
                        {titulo: 'Destinos',
                            frecuencias: frecuencias,
                            session: req.isAuthenticated()
                        });
            }).catch(function (err) {
                console.log("Error:", err);
                res.redirect('/destinosActivos');
            });
        }
    }
/**
 * buscar segun los campos ingresados en el formulario
 *
 * @section Admin 
 *  @type  get 
*  @param {solicitud} req 
 * @url /buscarDestino
 * @param {respuesta} es 
 */
/**
 * buscar segun los campos ingresados en el formulario
 *
 * @section Usuario 
 *  @type  get 
*  @param {solicitud} req 
 * @url /buscarDestino
 * @param {respuesta} es 
 */
    buscar(req, res) {

        //buscar segun los campos ingresados en el formulario
        if (req.body.origen_buscar === '' || req.body.destino_buscar === '') { //si el origen o el destino es nulo
            Frecuencia.findAll({
                include: [
                    {model: Ruta, where: {
                            $or: {
                                origen: req.body.origen_buscar, destino: req.body.destino_buscar
                            }}
                    },
                    {model: Bus}
                ]}).then(function (busqueda) {
                res.render('fragmentos/vistaUsuario/frmDestino',
                        {titulo: 'Busqueda de destinos',
                            frecuencias: busqueda, //presentar el resultado de la búsqueda
                            session: req.isAuthenticated()
                        });
            }).catch(function (err) {
                console.log("Error:", err);
                res.redirect('/error');
            });
        } else { //si se ingresa tanto origen como destino en el formulario de búsqueda
            Frecuencia.findAll({
                include: [
                    {model: Ruta, where: {
                            $and: {
                                origen: req.body.origen_buscar, destino: req.body.destino_buscar
                            }
                        }},
                    {model: Bus}
                ]}).then(function (busqueda) {
                res.render('fragmentos/vistaUsuario/frmDestino',
                        {titulo: 'Búsqueda de destinos',
                            frecuencias: busqueda,
                            session: req.isAuthenticated()
                        });
            }).catch(function (err) {
                console.log("Error:", err);
                res.redirect('/destinos');
            });
        }
    }
}

module.exports = rutaControlador;

