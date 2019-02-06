'use strict';
var models = require('../models');
var Bus = models.bus;
const uuidv4 = require('uuid/v4');
class unidadesControlador {

    guardar(req, res) {
        Bus.create({
            external_id: uuidv4(),
            numeroBus: req.body.numerobus,
            placa: req.body.placa,
            propietario: req.body.propietario,
            numeroAsientos: req.body.numeroasientos
        }).then(function (newBus, created) {
            if (newBus) {
                req.flash('info', 'Se ha creado correctamente');
                res.redirect('/administrador/buses');
            }
        });
    }

    verBuses(req, res) {


        Bus.findAll({where: {estado: true}}).then(function (buses) {


            res.render('fragmentos/vistaAdmin/frmBus',
                    {titulo: 'Administrar Unidades de Transporte',
                        buses: buses
                                //info: (req.flash('info') != '') ? req.flash('info') : '',
                                //error: (req.flash('error') != '') ? req.flash('error') : ''
                    });
        }).catch(function (err) {
            console.log("Error:", err);
            //req.flash('error', 'Hubo un error');
            res.redirect('/administrador/buses');
        });


    }

}

module.exports = unidadesControlador;