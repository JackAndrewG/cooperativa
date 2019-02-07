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
<<<<<<< HEAD
                        buses: buses
=======
                        buses: buses,
                        session: req.isAuthenticated()
>>>>>>> 64e0f0849801e10d629f877c735054d75a552373
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

<<<<<<< HEAD
module.exports = unidadesControlador;
=======
module.exports = unidadesControlador;
>>>>>>> 64e0f0849801e10d629f877c735054d75a552373
