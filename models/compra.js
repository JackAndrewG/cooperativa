module.exports = function (sequelize, Sequelize) {
    var persona = require('../models/persona');
    var Persona = new persona(sequelize, Sequelize);
    var Compra = sequelize.define('compra', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        external_id: {
            type: Sequelize.UUID
        },
        total: {
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

     
    /* Compra.belongsTo(Boleto, {
        foreingkey: 'id_boleto',
        constraints: false
    }); */
    Compra.associate= function (models){ //una compra tiene un boleto
        models.compra.hasOne(models.boleto, {
            foreignKey: 'id_compra'});
    };
    
    Compra.belongsTo(Persona, {
        foreignKey: 'id_persona',
        constraints: false
    });
    

    return Compra;
};