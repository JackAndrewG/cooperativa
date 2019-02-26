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
var total;
var frecID;
var boletoID;
var compraID;
var pago = false;
var asientos_solicitados;
class compraControlador {

    //Presentar todas las frecuencias disponibles en la Base de Datos
    verRutas(req, res) {
        Compra.findOne({
            //buscar en el modelo Compra donde el estado sea falso, con el objetivo de eliminar la compra del boleto en el caso
            //de que el pago no se haya completado exitosamente
            where: {estado: false}}).then(function (compra) {
            if (compra) {
                Compra.destroy({where: {id: compra.id}});
                Boleto.destroy({where: {id_compra: compra.id}});
            }
        });

        //buscar las Frecuencias donde su estado se verdadero y presentar los resultados en la vista de Compra
        Bus.findAll({where: {estado: true}}).then(function (buses) {
            Frecuencia.findAll({
                include: [
                    {model: Ruta},
                    {model: Bus}
                ], where: {estado: true}}).then(function (frecuencias) {
                frecuenciasA = frecuencias;
                console.log(frecuencias.id);
                var roles = req.user.rol;
                if (roles === "administrador") {
                    res.render('fragmentos/vistaUsuario/frmCompra',
                            {titulo: 'Compra de Boletos',
                                frecuencias: frecuencias,
                                session: req.isAuthenticated(),
                                roles: roles,
                                usuario: req.user.nombre,
                                info: req.flash("info")
                            });
                } else {
                    res.render('fragmentos/vistaUsuario/frmCompra',
                            {titulo: 'Compra de Boletos',
                                frecuencias: frecuencias,
                                session: req.isAuthenticated(),
                                usuario: req.user.nombre,
                                info: req.flash("info")
                            });
                }
            }).catch(function (err) {
                console.log("Error:", err);
                res.redirect('/inicio');
            });

        });

    }

    buscar(req, res) {

        //Buscar las Frecuencias segun la información enviada en el formulario de búsqueda
        if (req.body.fecha_buscar !== '' && req.body.origen_buscar === '' && req.body.destino_buscar === '') {
            //si se ingresa fecha pero no origen ni destino
            Frecuencia.findAll({where: {fecha: req.body.fecha_buscar},
                include: [
                    {model: Ruta},
                    {model: Bus}
                ]}).then(function (busqueda) {
                res.render('fragmentos/vistaUsuario/frmCompra',
                        {titulo: 'Compra de Boletos',
                            frecuencias: busqueda,
                            session: req.isAuthenticated()
                        });
            }).catch(function (err) {
                console.log("Error:", err);
                res.redirect('/comprar');
            });
        } else if (req.body.origen_buscar === '' || req.body.destino_buscar === '' && req.body.fecha_buscar === '') {
            //si se ingresa origen o destino y no la fecha
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
                        });
            }).catch(function (err) {
                console.log("Error:", err);
                res.redirect('/comprar');
            });
        } else if (req.body.origen_buscar !== '' && req.body.destino_buscar !== '' && req.body.fecha_buscar === '') {
            //si se ingresa origen y destino pero no la fecha
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
                        });
            }).catch(function (err) {
                console.log("Error:", err);
                res.redirect('/comprar');
            });
        } else if (req.body.origen_buscar !== '' && req.body.destino_buscar === '' && req.body.fecha_buscar !== '') {
            //si se ingresa el origen y la fecha pero no el destino
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
                        });
            }).catch(function (err) {
                console.log("Error:", err);
                res.redirect('/comprar');
            });
        } else if (req.body.origen_buscar === '' && req.body.destino_buscar !== '' && req.body.fecha_buscar !== '') {
            Frecuencia.findAll({where: {fecha: req.body.fecha_buscar},
                include: [
                    {model: Ruta, where: {destino: req.body.destino_buscar}},
                    {model: Bus}
                ]}).then(function (busqueda) {
                res.render('fragmentos/vistaUsuario/frmCompra',
                        {titulo: 'Compra de Boletos',
                            frecuencias: busqueda,
                            session: req.isAuthenticated()
                        });
            }).catch(function (err) {
                console.log("Error:", err);
                //req.flash('error', 'Hubo un error');
                res.redirect('/comprar');
            });
        } else {
            //en caso de ninguna de las condiciones anteriores se cumpla, buscar por fecha, origen, y destino
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
                        });
            }).catch(function (err) {
                console.log("Error:", err);
                //req.flash('error', 'Hubo un error');
                res.redirect('/comprar');
            });
        }
    }

    mostrarPago(req, res) {

        //Presentar el formulario de pago de acuerdo al id de la frecuencia enviada en la url
        var frecuencia = req.params.idFrecuencia;
        //buscar en el modelo Compra donde el estado sea falso, con el objetivo de eliminar la compra del boleto en el caso
        //de que el pago no se haya completado exitosamente
        Compra.findOne({
            where: {estado: false}}).then(function (compra) {
            if (compra) {
                Compra.destroy({where: {id: compra.id}});
                Boleto.destroy({where: {id_compra: compra.id}});
                res.redirect('/frecuencia/:idFrecuencia');
            }
        });


        Frecuencia.findOne({
            include: [
                {model: Ruta},
                {model: Bus}
            ], where: {id: frecuencia}}).then(function (frecuencias) {
            frecuenciasA = frecuencias;
            Boleto.findAll({where: {$and:
                            {hora: frecuencias.horario, fechaViaje: frecuencias.fecha}
                }}).then(function (boletos) { //devuelve la busqueda de todos los boletos con la misma hora y fecha
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
            res.redirect('/comprar');
        });

    }

    comprar(req, res) {

        //Almacenar en los modelos de venta y boleto la información enviada mediante el fomrulario de Pago
        var frecuencia_id = req.params.idFrecuencia;
        frecID = req.params.idFrecuencia;
        console.log(frecuencia_id);
        Frecuencia.findOne({
            //Buscar mediante el id de la frecuencia solocitada para verificar si existen asientos disponibles
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
                                                hora: req.body.hora,
                                                fechaViaje: req.body.fecha,
                                                NumeroAsiento: req.body.asientos,
                                                cantidadAsientos: req.body.cantidad_asientos,
                                                valorTotal: req.body.total,
                                                id_compra: newCompra.id,
                                                id_frecuencia: frecuencia_id
                                            }).then(function (newBoleto, err) {
                                                if (newBoleto) {
                                                    boletoID = newBoleto.id;
                                                    total = newBoleto.valorTotal;
                                                    console.log("Nuevo boleto creado");
                                                    res.redirect('/pago/tarjeta');
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
    }
// METODO QUE NOS PERMITE MOSTRAR EL FORMULARIO DE TARJETA
    tarjeta(req, res) {
        function request(callback) {
            var path = '/v1/checkouts';
            var data = querystring.stringify({
                'authentication.userId': '8a8294175d602369015d73bf00e5180c',
                'authentication.password': 'dMq5MaTD5r',
                'authentication.entityId': '8a8294175d602369015d73bf009f1808',
                'amount': total, //le pasamos el total a traves de una variable global al mon=mento de guardar el boleto
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
        //EL SIGUIENTE METODO CONSULTA LA ID PARA EL PAGO UNICO
        request(function (responseData) {
            //console.log(responseData);
            idPago = responseData.id;
            res.render('fragmentos/vistaUsuario/frmTarjeta',
                    {titulo: 'Pago con Tarjeta',
                        session: req.isAuthenticated(),
                        idPagoTarjeta: responseData.id
                    });
            console.log(responseData.id);
        });
    }

//COMPRUEBA QUE LA INFORMACION Y EL PAGO SEAN CORRECTOS
    comprobarPago(req, res) {

        function request(callback) {
            var path = '/v1/checkouts/' + idPago + '/payment'; //enviamos el  idPago a traves de una variable global
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
//LA SIGUIENTE FUNCION DEVUELVE LA DATA DE LA TRANSACCION
        request(function (responseData) {
             console.log(responseData);
            if (responseData.result.code === "000.100.110") { //si se cumple la condicion la transaccion fue exitosa
                return pago = true; //asignamos verdadero a una variable si el pago es correcto
            }
        });
        if (pago) { //si pago verdadero
            Frecuencia.findOne({
                where: {id: frecID}}).then(function (frecuenciaEncontrada) {
                if (frecuenciaEncontrada) {

                    console.log('Frecuencia encontrada');
                    //lo siguiente actualiza todas las frecuencias donde la hora y fecha sean las indicadas en la peticion siguiente
                    Frecuencia.update({asientosDisponibles: frecuenciaEncontrada.asientosDisponibles - (asientos_solicitados)},
                            {where: {
                                    $and: {
                                        horario: frecuenciaEncontrada.horario, fecha: frecuenciaEncontrada.fecha
                                    }
                                }}).spread(function (affectedCount, affectedRows) {
                        return Frecuencia.findAll();
                    }).then(function (frecuencias) {
                        //console.log(frecuencias);
                        console.log('Frecuencia actualizada');
                        req.flash('correcto', 'La compra se ha realizado con éxito');
                        res.redirect('/reporte');
                    });
                }
            });
            Compra.update({
            //Actualizar el estado de la compra
                estado: true
            }, {where: {id: compraID}}).then(function (editado, err) {
                if (editado) {
                    console.log("La compra ha sido completada");
                }
            });
        } else {
          req.flash('info', 'No se pudo completar la compra, por favor intente de nuevo');
          res.redirect('/comprar');
        }

    }


//MUESTRA EL REPORTE DEL BOLETO QUE SE ACABA DE COMPRAR
    verBoleto(req, res) {
        //Presentar el reporte con la informacion recientemente creada del boleto
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
            //asignamos las variables a sus estados por defecto
            //por seguridad con las URLS
            boletoID = 0;
            frecuenciasA = '';
            pago = false;
        });

    }

}
module.exports = compraControlador;
