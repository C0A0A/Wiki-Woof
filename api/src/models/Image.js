const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define("image", {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    urlImage: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    freezeTableName: true, 
    tableName: 'image',
    timestamps: false
 });
};