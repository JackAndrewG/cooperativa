module.exports = function (sequelize, Sequelize) {
    //var persona = require('../models/persona');
    //var Persona = new persona(sequelize, Sequelize);
    var frecuencia = require('../models/frecuencia');
    var Frecuencia = new frecuencia(sequelize, Sequelize);
    var compra = require('../models/compra');
    var Compra = new compra(sequelize, Sequelize);
    var Boleto = sequelize.define('boleto', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        external_id: {
            type: Sequelize.UUID
        },
        /*codigo: {
            type: Sequelize.INTEGER(20),
            allowNull: false,
            unique: true
        }, */
        hora: {
            type: Sequelize.TIME
        },
        fechaViaje: {
            type: Sequelize.DATEONLY
        },
        NumeroAsiento: {
            type: Sequelize.STRING(80)
        },
        cantidadAsientos: {
            type: Sequelize.INTEGER(2)
        },
        valorTotal: {
            type: Sequelize.DOUBLE(10,2)
        },
        estado: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        }

    }, {freezeTableName: true,
        createdAt: 'fecha_registro',
        updateAt: 'fecha_modificacion'
    });

    /*Boleto.belongsTo(Persona, {
        foreignKey: 'id_persona',
        constraints: false
    }); */
    Boleto.belongsTo(Frecuencia, {
        foreignKey: 'id_frecuencia',
        constraints: false
    });
    Boleto.belongsTo(Compra, {
        foreignKey: 'id_compra',
        constraints: false
    });

    return Boleto;
};
