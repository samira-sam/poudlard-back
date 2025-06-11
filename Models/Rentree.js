const { Model, DataTypes } = require("sequelize");
const sequelize = require("../Config/sequelize");




  class Rentree extends Model {}

Rentree.init(
  {
    id_rentree: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      info: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
  
  {
    sequelize,
    tableName: "rentree",
    timestamps: false,
  }
);

module.exports = Rentree;
