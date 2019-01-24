module.exports = function (sequelize, Sequelize) {
      var Bus = sequelize.define('Bus', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        external_id: {
            type: Sequelize.UUID
        },
        numeroBus: {
            type: Sequelize.Number(3)
            allowNull: false,
            unique: true
        },
         placa: {
            type: Sequelize.STRING(50)
            allowNull: false,
            unique: true
        },
        propietario: {
            type: Sequelize.STRING(50)
        },
        numeroAsientos: {
            type: Sequelize.STRING(50)
        },
        estado: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },

    }, {freezeTableName: true,
        createdAt: 'fecha_registro',
        updateAt: 'fecha_modificacion'
    });

    return Bus;
};
