'use strict';
var models = require('../models');
var Bus = models.bus;
const uuidv4 = require('uuid/v4');
class unidadesControlador {

    guardar(req, res, message) {
      Bus.findOne({where: {numeroBus: req.body.numerobus}}).then(function (existeN, placa) {
        if (existeN) {
          req.flash('alerta', 'ERROR AL GUARDAR, EL NUMERO DE BUS YA EXISTE');
          res.redirect('/administrador/buses');
        }else{
          Bus.findOne({where: {placa: req.body.placa}}).then(function (existeP, nuevo) {
            if (existeP) {
              req.flash('alerta', 'ERROR AL GUARDAR, LA PLACA YA ESTA REGISTRADA');
              res.redirect('/administrador/buses');
            }else{
                        Bus.create({
                            external_id: uuidv4(),
                            numeroBus: req.body.numerobus,
                            placa: req.body.placa,
                            propietario: req.body.propietario,
                            numeroAsientos: req.body.numeroasientos
                        }).then(function (newBus, err) {
                            if (newBus) {
                                req.flash('exito', 'DATOS GUARDADOS CORRECTAMENTE');
                            }
                            res.redirect('/administrador/buses');
                        });
            }
          });
        }
      });
    }

    editar(req, res, done) {

        Bus.update({
          numeroBus: req.body.numerobus,
          placa: req.body.placa,
          propietario: req.body.propietario,
          numeroAsientos: req.body.numeroasientos,
          estado: req.body.estado
        }, {where: {external_id: req.body.external}}).then(function (editado, err) {
            if (editado) {
                        req.flash('alerta', 'DATOS MODIFICADOS CORRECTAMENTE');
                        res.redirect('/administrador/buses');
                    }
        });
    }

    verBusesActivos(req, res) {
        Bus.findAll({where: {estado: true}}).then(function (buses) {
            res.render('fragmentos/vistaAdmin/frmBus',
                    {titulo: 'Administrar Unidades de Transporte',
                        buses: buses,
                        session: req.isAuthenticated(),
                        mensaje: req.flash("alerta"),
                        exito: req.flash("exito")
                    });
        }).catch(function (err) {
            console.log("Error:", err);
            //req.flash('error', 'Hubo un error');
            res.redirect('/administrador/busesActivos');
        });
    }

    verBuses(req, res) {
        Bus.findAll({}).then(function (buses) {
            res.render('fragmentos/vistaAdmin/frmBus',
                    {titulo: 'Administrar Unidades de Transporte',
                        buses: buses,
                        session: req.isAuthenticated(),
                        mensaje: req.flash("alerta"),
                        exito: req.flash("exito")
                    });
        }).catch(function (err) {
            console.log("Error:", err);
            //req.flash('error', 'Hubo un error');
            res.redirect('/administrador/buses');
        });
    }
}


module.exports = unidadesControlador;
