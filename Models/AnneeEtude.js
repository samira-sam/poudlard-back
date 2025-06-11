const { Model, DataTypes } = require("sequelize");
const sequelize = require("../Config/sequelize");

class AnneeEtude extends Model {}

AnneeEtude.init(
  {
    id_annee_etude: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  
  },
  {
    sequelize,
    tableName: "annee_etude",
    timestamps: false,
  }
);

module.exports = AnneeEtude;
