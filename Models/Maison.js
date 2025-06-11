const { Model, DataTypes } = require("sequelize");
const sequelize = require("../Config/sequelize");


class Maison extends Model {}

Maison.init(
  {
    id_maison: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    histoire: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    embleme: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    couleurs: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    photo: {
            type: DataTypes.STRING(255),
            allowNull: false,
          },  
    id_prefet: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_directeur: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "maison",
    timestamps: false,
  }
);

module.exports = Maison;
