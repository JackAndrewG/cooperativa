module.exports = function (sequelize, Sequelize) {
    
    var Ruta = sequelize.define('ruta', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        external_id: {
            type: Sequelize.UUID
        },
        origen: {
            type: Sequelize.STRING(10)
        },
         destino: {
            type: Sequelize.STRING(50)
        },
        valor: {
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
    
    Ruta.associate = function (models) {
        models.ruta.hasMany(models.frecuencia, {
            foreignKey: 'id_ruta'
        });
    }; 

    return Ruta;
};

//una frecuencia tiene muchas rutas