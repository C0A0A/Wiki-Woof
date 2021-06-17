const {DataTypes} = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
	// defino el modelo
	sequelize.define(
		'dog',
		{
			id: {
				type: DataTypes.UUID,
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			height: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			weight: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			life_span: {
				type: DataTypes.STRING,
				defaultValue: '10 - 13 (promedio)',
			},
		},
		{
			freezeTableName: true,
			tableName: 'dog',
			timestamps: false,
		}
	);
};
