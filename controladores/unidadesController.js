'use strict';
var models = require('./../models');
var Bus = models.bus;
const uuidv4 = require('uuid/v4');
class UnidadesController {
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
              //  res.redirect('/josselyn/administrar/vino');
            }
        });
    }

  }
