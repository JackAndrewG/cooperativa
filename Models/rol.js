module.exports = function (sequelize, Sequelize){
    var Rol = sequelize.define('rol', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER

        },
        external_id: {
            type: Sequelize.UUID
        },
        nombre: {
            type: Sequelize.STRING(20)
        },
        estado: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        }
    }, {freezeTableName: true, timestamps: false});

    Rol.associate = function (models){
        models.rol.hasMany(models.Persona, {
            foreignKey: 'id_rol'
        });
    }
    return Rol;
};
