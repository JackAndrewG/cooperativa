'use strict';
var models = require('../models');
var Ruta = models.ruta;
var Frecuencia = models.frecuencia;
var Bus = models.bus;
var Boleto = models.boleto;
var Compra = models.compra;
var Persona = models.persona;
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
                            usuario: req.user.nombre,
                            info: req.flash("info")
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

        if (req.body.origen_buscar === '' || req.body.destino_buscar === '') {
            Frecuencia.findAll({
                include: [
                    {model: Ruta, where: {
                            $or: {
                                origen: req.body.origen_buscar, destino: req.body.destino_buscar
                            }}
                    },
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
                //  res.redirect('/comprar');
            }).catch(function (err) {
                console.log("Error:", err);
                //req.flash('error', 'Hubo un error');
                res.redirect('/comprar');
            });
        } else {
            Frecuencia.findAll({
                include: [
                    {model: Ruta, where: {
                            $and: {
                                origen: req.body.origen_buscar, destino: req.body.destino_buscar
                            }
                        }},
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
                //      res.redirect('/comprar');
            }).catch(function (err) {
                console.log("Error:", err);
                //req.flash('error', 'Hubo un error');
                res.redirect('/comprar');
            });
        }
    }

    comprar(req, res) {





        Frecuencia.findOne({
            where: {id: req.body.id_frecuencia}}).then(function (frecuencia) {
            if (frecuencia) {
                var asientos_solicitados = req.body.cantidad_asientos;
                var asientos_disponibles = frecuencia.asientosDisponibles;
                if (asientos_disponibles === 0) {
                    req.flash('info', 'No hay asientos disponibles');
                    console.log('No hay asientos disponibles');
                    res.redirect('/comprar');
                } else if (asientos_solicitados > asientos_disponibles) {
                    console.log('La cantidad que solicita comprar supera el numero de asientos disponibles');
                    req.flash('info', 'La cantidad que solicita comprar supera el numero de asientos disponibles');
                    res.redirect('/comprar');
                } else {
                    Boleto.findOne({
                        where: {
                            $and: {
                                id_frecuencia: req.body.id_frecuencia, NumeroAsiento: req.body.asientos
                            }
                        }}).then(function (asientoOcupado) {
                        if (asientoOcupado) {
                            console.log("El asiento esta ocupado");
                            req.flash('info', 'El asiento está ocupado');
                            res.redirect('/comprar');
                        } else {

                            console.log('Entrando al else ');
                            //comparar los asientos

                            //req.flash('alerta', 'ERROR AL GUARDAR, EL NUMERO DE BUS YA EXISTE');
                            //res.redirect('/busesActivos');

                            var user = req.user.id_persona;
                            console.log(user);
                            Persona.findOne({where: {external_id: user}}).then(function (persona) {
                                var compra = {
                                    external_id: uuidv4(),
                                    //fecha: new Date(),
                                    total: req.body.total,
                                    id_persona: persona.id
                                };
                                Compra.create(compra).then(function (newCompra, created) {
                                    if (newCompra) {
                                        //    var detalle = [];
                                        if (persona) {
                                            console.log("Nueva compra creada, listo para asignar boleto");
                                            Boleto.create({
                                                external_id: uuidv4(),
                                                fechaViaje: req.body.fecha,
                                                NumeroAsiento: req.body.asientos,
                                                cantidadAsientos: req.body.cantidad_asientos,
                                                valorTotal: req.body.total,
                                                id_compra: newCompra.id,
                                                id_frecuencia: req.body.id_frecuencia
                                            }).then(function (newBoleto, err) {
                                                if (newBoleto) {
                                                    console.log("Nuevo boleto creado");
                                                    //req.flash('exito', 'DATOS GUARDADOS CORRECTAMENTE');
                                                    Frecuencia.findOne({
                                                        where: {id: req.body.id_frecuencia}}).then(function (frecuenciaEncontrada) {
                                                        if (frecuenciaEncontrada) {

                                                            console.log('Frecuencia encontrada');
                                                            Frecuencia.update({asientosDisponibles: frecuenciaEncontrada.asientosDisponibles - (req.body.cantidad_asientos)},
                                                                    {where: {id: req.body.id_frecuencia}});
                                                            console.log('Frecuencia actualizada');
                                                            req.flash('info', 'La compra se ha realizado con éxito');
                                                            res.redirect('/comprar');
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    }
                                });
                            });
                        }
                    });
                }

            }

        });

        //llenar modelo boleto
        //cantidad: req.body.boleto;
        //guardar la fecha del viaje en el boleto
        //para comprobar q no sea el mismo asiento comparar con cada boleto segun la fecha y el numero de asiento q tiene buscando con boleto.findall
        //para la capacidad ir restando segun la cantidad de boletos vendidos


        //recorer todos los boletos con un select y solamente que se muestren los que estan disponibles 
        //ir creando mas inputs para poner ahi el nro de asiento en caso de que la cantidad de asientos sea mayor a uno
        //el nro de asiento de cada input concatenarlo y guardarlo en la bd

    }

}





module.exports = compraControlador;