const { Model, DataTypes } = require("sequelize");
const sequelize = require("../Config/sequelize");

class Bdc extends Model {}

Bdc.init(
  {
    id_bdc: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: true
      },
    pdf: {
        type: DataTypes.TEXT,
        allowNull: true
      },
   
},
    
  {
    sequelize,
    tableName: "bdc",
    timestamps: false,
  }
);

module.exports = Bdc;