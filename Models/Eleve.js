const { Model, DataTypes } = require("sequelize");
const sequelize = require("../Config/sequelize");

class Eleve extends Model {}

Eleve.init(
  {


    id_eleve: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: false,
      references: {
        model: 'utilisateur', // Nom de la table référencée
        key: 'id_utilisateur', // Nom de la colonne référencée dans la table `utilisateur`
      },
    },
    
    
    contact_parent: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    id_maison: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_annee_etude: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    
  },
  {
    sequelize,
    tableName: "eleve",
    timestamps: false,
  }
);

module.exports = Eleve;
