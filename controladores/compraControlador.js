'use strict';
var models = require('../models');
var Ruta = models.ruta;
var Frecuencia = models.frecuencia;
var Bus = models.bus;
const uuidv4 = require('uuid/v4');


class compraControlador {
    verRutas(req, res) {

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
                res.render('fragmentos/vistaUsuario/frmCompra',
                        {titulo: 'Compra de Boletos',
                            frecuencias: frecuencias,
                            //  buses: buses,
                            session: req.isAuthenticated(),
                            // info: req.flash("info_editar")
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

    buscar(req, res) {
        
        Frecuencia.findAll({
                include: [
                    {model: Ruta, where: {origen: req.body.origen_buscar, destino: req.body.destino_buscar}},
                    {model: Bus}
                ]}).then(function (busqueda) {
                res.render('fragmentos/vistaUsuario/frmCompra',
                        {titulo: 'Compra de Boletos',
                            frecuencias: busqueda,
                            session: req.isAuthenticated()
                            // info: req.flash("info_editar")
                            //info: (req.flash('info') != '') ? req.flash('info') : '',
                            //error: (req.flash('error') != '') ? req.flash('error') : ''
                        });
            }).catch(function (err) {
                console.log("Error:", err);
                //req.flash('error', 'Hubo un error');
                res.redirect('/comprar');
            });
        
       /* Ruta.findAll( {where: {origen: req.body.nombre_buscar}}, (err, busqueda) => {
            res.render('fragmentos/vistaUsuario/frmCompra',
                    {titulo: 'Compra de Boletos',
                        frecuencias: busqueda,
                        //  buses: buses,
                        session: req.isAuthenticated()

                                // info: req.flash("info_editar")
                                //info: (req.flash('info') != '') ? req.flash('info') : '',
                                //error: (req.flash('error') != '') ? req.flash('error') : ''
                    });

        }); */
    }
}





module.exports = compraControlador;

