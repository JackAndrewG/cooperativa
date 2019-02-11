'use strict';
var models = require('../models');
var Ruta = models.ruta;
var Frecuencia = models.frecuencia;
var Bus = models.bus;
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
                req.flash('info_correcto', 'Se ha guardado correctamente');
                Frecuencia.create({
                    external_id: uuidv4(),
                    horario: req.body.hora_salida,
                    id_ruta: newRuta.id,
                    id_bus: req.body.bus
                }).then(function (newFrecuencia, created) {
                    if (newFrecuencia) {
                        //req.flash('info', 'Se ha creado correctamente');

                        console.log("Se ha creado correctamente");
                        res.redirect('/destinosActivos');
                    }
                });
            }
        });



    }

    editar(req, res) {

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


    verRutas(req, res) {

        Bus.findAll().then(function (buses) {
            Frecuencia.findAll({
                include: [
                            {model: Ruta},
                            {model: Bus}
                ] }).then(function (frecuencias) {
            /*   frecuencias.forEach(element =>{
                    console.log(element);
                }); */
            //console.log(frecuencias.ruta)
                res.render('fragmentos/vistaAdmin/frmDestino',
                        {titulo: 'Administrar Destinos',
                            frecuencias: frecuencias,
                            buses: buses,
                            session: req.isAuthenticated(),
                            info: req.flash("info_correcto")
                                    //info: (req.flash('info') != '') ? req.flash('info') : '',
                                    //error: (req.flash('error') != '') ? req.flash('error') : ''
                        });
            }).catch(function (err) {
                console.log("Error:", err);
                //req.flash('error', 'Hubo un error');
                res.redirect('/destinos');
            });
        });


    }
    
    verRutasActivas(req, res) {
        
        Bus.findAll({where: {estado: true}}).then(function (buses) {
            Frecuencia.findAll({
                include: [
                            {model: Ruta},
                            {model: Bus}
                ], where: {estado: true}}).then(function (frecuencias) {
            /*   frecuencias.forEach(element =>{
                    console.log(element);
                }); */
            //console.log(frecuencias.ruta)
                res.render('fragmentos/vistaAdmin/frmDestino',
                        {titulo: 'Administrar Destinos',
                            frecuencias: frecuencias,
                            buses: buses,
                            session: req.isAuthenticated(),
                            info: req.flash("info_correcto")
                                    //info: (req.flash('info') != '') ? req.flash('info') : '',
                                    //error: (req.flash('error') != '') ? req.flash('error') : ''
                        });
            }).catch(function (err) {
                console.log("Error:", err);
                //req.flash('error', 'Hubo un error');
                res.redirect('/destinosActivos');
            });
        });
        
        
        
        
     
    }
}

module.exports = rutaControlador;