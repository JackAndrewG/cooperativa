module.exports = function (sequelize, Sequelize) {
      var Bus = sequelize.define('bus', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        external_id: {
            type: Sequelize.UUID
        },
        numeroBus: {
            type: Sequelize.INTEGER(3),
            allowNull: false,
            unique: true
        },
        placa: {
            type: Sequelize.STRING(50),
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
    
    Bus.associate = function (models) {
        models.bus.hasMany(models.frecuencia, {
            foreignKey: 'id_bus'
        });
    }; 

    return Bus;
};
