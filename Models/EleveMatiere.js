const { Model, DataTypes } = require("sequelize");
const sequelize = require("../Config/sequelize");

class EleveMatiere extends Model {}

EleveMatiere.init(
    {
      id_eleve: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: 'eleve', // IMPORTANT: Mets ici le VRAI nom de ta table Eleves (pas le nom du modèle, mais le nom de la table dans la base de données)
          key: 'id_eleve'      // IMPORTANT: Mets ici le VRAI nom de la colonne clé primaire de ta table Eleves (souvent 'id')
        }
      },
      id_matiere: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: 'matiere', // IMPORTANT: Mets ici le VRAI nom de ta table Matieres
          key: 'id_matiere'         // IMPORTANT: Mets ici le VRAI nom de la colonne clé primaire de ta table Matieres
        }
      },
    },
    {
      sequelize,
      modelName: "eleve_matiere", // Tu peux aussi choisir "EleveMatiere" pour suivre la casse du nom de la classe
      tableName: "eleve_matiere",
      timestamps: false,
    }
  );
  module.exports = EleveMatiere;