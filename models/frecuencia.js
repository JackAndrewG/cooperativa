module.exports = function (sequelize, Sequelize) {
    var bus = require('../models/bus');
    var Bus = new bus(sequelize, Sequelize);
    var ruta = require('../models/ruta');
    var Ruta = new ruta(sequelize, Sequelize);
    var Frecuencia = sequelize.define('frecuencia', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        external_id: {
            type: Sequelize.UUID
        },
        horario: {
            type: Sequelize.STRING(10)
        },
        fecha: {
            type: Sequelize.DATEONLY //se crea como datetime, cambiar en la base de datos por date
        },
        asientosDisponibles: {
            type: Sequelize.INTEGER
        },
        estado: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },

    }, {freezeTableName: true,
        createdAt: 'fecha_registro',
        updateAt: 'fecha_modificacion'
    });

    
    Frecuencia.belongsTo(Ruta, {
        foreignKey: 'id_ruta',
        constraints: false
    });
    
    Frecuencia.belongsTo(Bus, {
        foreignKey: 'id_bus',
        constraints: false
    });
    
    Frecuencia.associate= function (models){
        models.frecuencia.hasMany(models.boleto, {
            foreignKey: 'id_frecuencia'
        });
    };
    

    return Frecuencia;
};