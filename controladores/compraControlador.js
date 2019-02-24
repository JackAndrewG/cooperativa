'use strict';
var models = require('../models');
var Ruta = models.ruta;
var Frecuencia = models.frecuencia;
var Bus = models.bus;
var Boleto = models.boleto;
var Compra = models.compra;
var Persona = models.persona;
const uuidv4 = require('uuid/v4');
var https = require('https');
var querystring = require('querystring');
var frecuenciasA;
var idPago;
var frecID;
var boletoID;
var compraID;
var pago = false;
var asientos_solicitados;
class compraControlador {
    verRutas(req, res) {

        Compra.findOne({
            where: {estado: false}}).then(function (compra) {
            if (compra) {
                Compra.destroy({where: {id: compra.id}});
                Boleto.destroy({where: {id_compra: compra.id}});
            }
        });

        Bus.findAll({where: {estado: true}}).then(function (buses) {
            Frecuencia.findAll({
                include: [
                    {model: Ruta},
                    {model: Bus}
                ], where: {estado: true}}).then(function (frecuencias) {
                frecuenciasA = frecuencias;
                /*   frecuencias.forEach(element =>{
                 console.log(element);
                 }); */
                //console.log(frecuencias.ruta)
                //  var origen_actual = frecuencias.rutum.origen;
                // console.log(origen_actual);

                console.log(frecuencias.id)

                // res.send({frecuencias: frecuencias});
                var roles = req.user.rol;
                if (roles === "administrador") {
                    res.render('fragmentos/vistaUsuario/frmCompra',
                            {titulo: 'Compra de Boletos',
                                frecuencias: frecuencias,
                                //  buses: buses,
                                session: req.isAuthenticated(),
                                roles: roles,
                                usuario: req.user.nombre,
                                info: req.flash("info")
                                        // info: req.flash("info_editar")
                                        //info: (req.flash('info') != '') ? req.flash('info') : '',
                                        //error: (req.flash('error') != '') ? req.flash('error') : ''
                            });
                } else {
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
                }

            }).catch(function (err) {
                console.log("Error:", err);
                //req.flash('error', 'Hubo un error');
                res.redirect('/error');
            });

        });

    }

    buscar(req, res) {

        if (req.body.fecha_buscar !== '' && req.body.origen_buscar === '' && req.body.origen_buscar === '') {

            Frecuencia.findAll({where: {fecha: req.body.fecha_buscar},
                include: [
                    {model: Ruta},
                    {model: Bus}
                ]}).then(function (busqueda) {
                // res.send({busqueda});
                //res.send({frecuencias: req.body.fecha_buscar})
                res.render('fragmentos/vistaUsuario/frmCompra',
                        {titulo: 'Compra de Boletos',
                            frecuencias: busqueda,
                            session: req.isAuthenticated()
                                    // info: req.flash("info_editar")
                                    //info: (req.flash('info') != '') ? req.flash('info') : '',
                                    //error: (req.flash('error') != '') ? req.flash('error') : ''
                        });
                //2019 02 24
            }).catch(function (err) {
                console.log("Error:", err);
                //req.flash('error', 'Hubo un error');
                res.redirect('/error');
            });
        } else if (req.body.origen_buscar === '' || req.body.destino_buscar === '' && req.body.fecha_buscar === '') {
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
        } else if (req.body.origen_buscar !== '' && req.body.destino_buscar !== '' && req.body.fecha_buscar === '') {
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
        } else if (req.body.origen_buscar !== '' && req.body.destino_buscar === '' && req.body.fecha_buscar !== '') {
            Frecuencia.findAll({where: {fecha: req.body.fecha_buscar},
                include: [
                    {model: Ruta, where: {
                            origen: req.body.origen_buscar
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
        } else {
            Frecuencia.findAll({where: {fecha: req.body.fecha_buscar},
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

    mostrarPago(req, res) {
        var frecuencia = req.params.idFrecuencia;



        Frecuencia.findAll({
            include: [
                {model: Ruta},
                {model: Bus}
            ], where: {id: frecuencia}}).then(function (frecuencias) {
            frecuenciasA = frecuencias;
            Boleto.findAll({where: {id_frecuencia: frecuencia}}).then(function (boletos) {
                // res.send({boletos: boletos});
                Frecuencia.findOne({
                    include: [
                        {model: Ruta},
                        {model: Bus}
                    ], where: {id: frecuencia, asientosDisponibles: 0}}).then(function (frecOne) {
                    if (frecOne) {
                        req.flash('info', 'No hay asientos disponibles');
                        res.render('fragmentos/vistaUsuario/frmPago',
                                {titulo: 'Pago del boleto',
                                    frecuencias: frecuencias,
                                    boletos: boletos,
                                    session: req.isAuthenticated(),
                                    usuario: req.user.nombre,
                                    info: req.flash("info")
                                });
                    } else {
                        res.render('fragmentos/vistaUsuario/frmPago',
                                {titulo: 'Pago del boleto',
                                    frecuencias: frecuencias,
                                    boletos: boletos,
                                    session: req.isAuthenticated(),
                                    usuario: req.user.nombre
                                });
                    }
                });

            });


        }).catch(function (err) {
            console.log("Error:", err);
            req.flash('error', 'Hubo un error');
            res.redirect('/destinos');
        });

    }

    comprar(req, res) {

        var frecuencia_id = req.params.idFrecuencia;
        frecID = req.params.idFrecuencia;
        console.log(frecuencia_id);

        Frecuencia.findOne({
            where: {id: frecuencia_id}}).then(function (frecuencia) {
            if (frecuencia) {
                asientos_solicitados = req.body.cantidad_asientos;
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
                                id_frecuencia: frecuencia_id, NumeroAsiento: req.body.asientos
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
                                    estado: false,
                                    total: req.body.total,
                                    id_persona: persona.id
                                };
                                Compra.create(compra).then(function (newCompra, created) {
                                    if (newCompra) {
                                        compraID = newCompra.id;
                                        if (persona) {
                                            console.log("Nueva compra creada, listo para asignar boleto");
                                            Boleto.create({
                                                external_id: uuidv4(),
                                                fechaViaje: req.body.fecha,
                                                NumeroAsiento: req.body.asientos,
                                                cantidadAsientos: req.body.cantidad_asientos,
                                                valorTotal: req.body.total,
                                                id_compra: newCompra.id,
                                                id_frecuencia: frecuencia_id
                                            }).then(function (newBoleto, err) {
                                                if (newBoleto) {
                                                    boletoID = newBoleto.id;
                                                    var total = newBoleto.valorTotal;
                                                    console.log("Nuevo boleto creado");
                                                    res.redirect('/pago/tarjeta/' + total);
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

    tarjeta(req, res) {
        var total = req.params.total;
        function request(callback) {
            var path = '/v1/checkouts';
            var data = querystring.stringify({
                'authentication.userId': '8a8294175d602369015d73bf00e5180c',
                'authentication.password': 'dMq5MaTD5r',
                'authentication.entityId': '8a8294175d602369015d73bf009f1808',
                'amount': total,
                'currency': 'USD',
                'paymentType': 'DB'
            });
            var options = {
                port: 443,
                host: 'test.oppwa.com',
                path: path,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': data.length
                }
            };
            var postRequest = https.request(options, function (res) {
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    var jsonRes = JSON.parse(chunk);
                    return callback(jsonRes);
                });
            });
            postRequest.write(data);
            postRequest.end();
        }
        request(function (responseData) {
            console.log(responseData);
            idPago = responseData.id;
            res.render('fragmentos/vistaUsuario/frmTarjeta',
                    {titulo: 'Pago con Tarjeta',
                        session: req.isAuthenticated(),
                        idPagoTarjeta: responseData.id
                    });
            console.log(responseData.id);
        });
    }

    comprobarPago(req, res) {

        function request(callback) {
            var path = '/v1/checkouts/' + idPago + '/payment';
            path += '?authentication.userId=8a8294175d602369015d73bf00e5180c';
            path += '&authentication.password=dMq5MaTD5r';
            path += '&authentication.entityId=8a8294175d602369015d73bf009f1808';
            var options = {
                port: 443,
                host: 'test.oppwa.com',
                path: path,
                method: 'GET',
            };
            var postRequest = https.request(options, function (res) {
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    var jsonRes = JSON.parse(chunk);
                    return callback(jsonRes);
                });
            });
            postRequest.end();
        }

        request(function (responseData) {
            console.log(responseData);
            if (responseData.result.code === "000.100.110") {
                return pago = true;
                //compraControlador.respuestaComprobacion(pago);
                req.flash('correcto', 'La compra se ha realizado con éxito');
            }
        });
        if (pago) {
            Frecuencia.findOne({
                where: {id: frecID}}).then(function (frecuenciaEncontrada) {
                if (frecuenciaEncontrada) {

                    console.log('Frecuencia encontrada');
                    Frecuencia.update({asientosDisponibles: frecuenciaEncontrada.asientosDisponibles - (asientos_solicitados)},
                            {where: {id: frecID}});
                    console.log('Frecuencia actualizada');
                    req.flash('correcto', 'La compra se ha realizado con éxito');
                    res.redirect('/reporte');
                }
            });
            Compra.update({
                estado: true
            }, {where: {id: compraID}}).then(function (editado, err) {
                if (editado) {
                    console.log("La compra ha sido completada");
                }
            });
        } else {



            /*  Boleto.destroy({where: {id: boletoID}});
             Compra.destroy({where: {id: compraID}});
             req.flash('info', 'No se ha completado el pago exitosamente');
             res.redirect('/comprar'); */
        }

    }

    verBoleto(req, res) {

        Boleto.findAll({
            where: {
                id: boletoID
            }
        }).then(function (boleto) {
            
            res.render('fragmentos/vistaUsuario/reporte', {
                titulo: 'Boleto',
                frecuencias: frecuenciasA,
                boleto: boleto,
                session: req.isAuthenticated(),
                cliente: req.user.nombre,
                info: req.flash("correcto")
            });
            boletoID = 0;
            frecuenciasA = '';
            pago = false;
        });

    }

}
module.exports = compraControlador;
