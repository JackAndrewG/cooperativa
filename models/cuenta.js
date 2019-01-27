module.exports = function (sequelize, Sequelize) {
    var persona = require('../models/persona');
    var Persona = new persona(sequelize, Sequelize);
    var Cuenta = sequelize.define('cuenta', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        external_id: {
            type: Sequelize.UUID
        },
        usuario: {
            type: Sequelize.STRING(30)
        },
        clave: {
            type: Sequelize.STRING
        },

        estado: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        }

    }, {freezeTableName: true,
        createdAt: "fecha_registro",
        updateAt: 'fecha_modificacion'
    });

    Cuenta.belongsTo(Persona, {
        foreignKey: 'id_persona',
        constraints: false
    });
    
    return Cuenta;
};
