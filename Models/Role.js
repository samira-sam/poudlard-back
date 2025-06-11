const { Model, DataTypes } = require('sequelize');
const sequelize = require('../Config/sequelize'); 

class Role extends Model {}

Role.init(
  {
    id_role: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'role',
    tableName: 'role',
    timestamps: false,
  }
);

module.exports = Role;
