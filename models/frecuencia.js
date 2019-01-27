module.exports = function (sequelize, Sequelize) {
    var bus = require('../models/bus');
    var Bus = new bus(sequelize, Sequelize);
    var ruta = require('../models/ruta');
    var Ruta = new ruta(sequelize, Sequelize);
    var Frecuencia = sequelize.define('Frecuencia', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        external_id: {
            type: Sequelize.UUID
        },
        horario: {
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

   Frecuencia.belongsTo(Bus, {
        foreingkey: 'id_bus',
        constraints: false
    });
    Frecuencia.belongsTo(Ruta, {
        foreingkey: 'id_ruta',
        constraints: false
    });

    return Frecuencia;
};
