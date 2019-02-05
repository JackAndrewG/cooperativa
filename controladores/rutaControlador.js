'use strict';
var models = require('../models');
var Ruta = models.ruta;
var Frecuencia = models.frecuencia;
const uuidv4 = require('uuid/v4');

class rutaControlador {
    guardar(req, res) {

        Ruta.create({
            external_id: uuidv4(),
            origen: req.body.origen,
            destino: req.body.destino,
            valor: req.body.valor
        }).then(function (newRuta, created) {
            if (newRuta) {
                //req.flash('info', 'Se ha creado correctamente');
                Frecuencia.create({
                    external_id: uuidv4(),
                    horario: req.body.hora_salida,
                    id_ruta: newRuta.id
                }).then(function (newFrecuencia, created) {
                    if (newFrecuencia) {
                        //req.flash('info', 'Se ha creado correctamente');

                        console.log("Se ha creado correctamente");
                        res.redirect('/destinos');
                    }
                });


                console.log("Se ha creado correctamente");
                res.redirect('/destinos');
            }
        });



    }
}

module.exports = rutaControlador;
