const { Model, DataTypes } = require("sequelize");
const sequelize = require("../Config/sequelize");

class Matiere extends Model {}
Matiere.init(
  {
    id_matiere: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
   photo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  
  },
  {
    sequelize,
    tableName: "matiere",
    timestamps: false,
  }
);

module.exports = Matiere;

