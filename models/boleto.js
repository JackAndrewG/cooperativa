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
            type: Sequelize.INTEGER(20),
            allowNull: false,
            unique: true
        },
         NumeroAsiento: {
            type: Sequelize.STRING(80)
        },
        cantidadAsientos: {
            type: Sequelize.INTEGER(2)
        },
        valorTotal: {
            type: Sequelize.DOUBLE(4,2)
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
