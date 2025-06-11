const { Model, DataTypes } = require("sequelize");
const sequelize = require("../Config/sequelize");

class Professeur extends Model {}

Professeur.init(
  {
    id_professeur: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: false,
      references: {
        model: 'utilisateur', // Nom de la table référencée
        key: 'id_utilisateur', // Nom de la colonne référencée dans la table `utilisateur`
      },
    },
    description: {
      type: DataTypes.TEXT
    },
   
    id_matiere: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "matiere",
        key: "id_matiere",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  
    fonction: {
  type: DataTypes.ENUM('professeur', 'directeur', 'directeur_adjoint'),
  defaultValue: 'professeur',
  allowNull: false
},
  },
  {
    sequelize,
    modelName: "Professeur",
    tableName: "professeur",
    timestamps: false,
  }
);

module.exports = Professeur;
