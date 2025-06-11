const { Model, DataTypes } = require("sequelize");
const sequelize = require("../Config/sequelize");

class Admin extends Model {}

Admin.init(
  {
  id_admin: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'utilisateur',
      key: 'id_utilisateur',
    },
    onDelete: 'CASCADE'
  }
}, {
    sequelize, 
    tableName: 'admin',
    modelName: 'Admin', 
    timestamps: false,
  });

module.exports = Admin;
