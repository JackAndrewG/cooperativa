module.exports = function (sequelize, Sequelize) {
    var persona = require('../models/persona');
    var Persona = new persona(sequelize, Sequelize);
    var frecuencia = require('../models/frecuencia');
    var Frecuencia = new frecuencia(sequelize, Sequelize);
    var Boleto = sequelize.define('Boleto', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        external_id: {
            type: Sequelize.UUID
        },
        codigo: {
            type: Sequelize.Number(20),
            allowNull: false,
            unique: true
        },
         NumeroAsiento: {
            type: Sequelize.Number(20)
        },
        cantidadAsientos: {
            type: Sequelize.Number(20)
        },
        valorTotal: {
            type: Sequelize.Number(20)
        },
        estado: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },

    }, {freezeTableName: true,
        createdAt: 'fecha_registro',
        updateAt: 'fecha_modificacion'
    });

    Boleto.belongsTo(Persona, {
        foreingkey: 'id_persona',
        constraints: false
    });
    Boleto.belongsTo(Frecuencia, {
        foreingkey: 'id_frecuencia',
        constraints: false
    });

    return Boleto;
};
