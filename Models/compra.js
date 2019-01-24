module.exports = function (sequelize, Sequelize) {
    var persona = require('../models/persona');
    var Persona = new persona(sequelize, Sequelize);
    var boleto = require('../models/boleto');
    var Boleto = new boleto(sequelize, Sequelize);
    var Compra = sequelize.define('Persona', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        external_id: {
            type: Sequelize.UUID
        },
        pagoTarjeta: {
            type: Sequelize.STRING(10),
        },
        estado: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },

    }, {freezeTableName: true,
        createdAt: 'fecha_registro',
        updateAt: 'fecha_modificacion'
    });

    Compra.belongsTo(Persona, {
        foreingkey: 'id_persona',
        constraints: false
    });
    Compra.belongsTo(Boleto, {
        foreingkey: 'id_boleto',
        constraints: false
    });

    return Compra;
};
