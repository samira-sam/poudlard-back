/*const { Model, DataTypes } = require("sequelize");
const sequelize = require("../Config/sequelize");
const { text } = require("body-parser");

class Utilisateur extends Model {}

Utilisateur.init(
  {
    id_utilisateur: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      references: {
        model: 'utilisateur', // Nom de la table référencée
        key: 'id_utilisateur', // Nom de la colonne référencée dans la table `utilisateur`
      },
    },
    nom: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    prenom: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    mot_de_passe: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    photo: {
       type: DataTypes.TEXT,
  allowNull: true,
       
    },
     // CHANGEMENT ICI : Utilisez 'id_role' comme nom de colonne
    id_role: {
      type: DataTypes.INTEGER, // Le type doit correspondre à la clé étrangère
      allowNull: true, // Peut être NULL car DELETE SET NULL
      field: 'id_role',
      references: { // Ceci est important pour définir la relation
        model: 'role', // Référence la table 'role'
        key: 'id_role',     // Référence la colonne 'id' de la table 'role'
      },
    },
     
  },
  {
    sequelize,
    tableName: "utilisateur",
    timestamps: false,
    idAttribute: 'id_utilisateur',
  }
  
);

module.exports = Utilisateur;*/


const { Model, DataTypes } = require("sequelize");
const sequelize = require("../Config/sequelize");

class Utilisateur extends Model {}

Utilisateur.init(
  {
    id_utilisateur: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      references: {
        model: 'utilisateur',
        key: 'id_utilisateur',
      },
    },
    nom: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    prenom: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    mot_de_passe: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    photo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    id_role: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'id_role',
      references: {
        model: 'role',
        key: 'id_role',
      },
    },

    // 🔐 Champs pour le mot de passe oublié
  resetPasswordExpires: {
      type: DataTypes.BIGINT, // ⭐ CORRECTION : DOIT ÊTRE BIGINT pour stocker un timestamp numérique (Date.now())
      allowNull: true,
      defaultValue: null,
    },
    resetPasswordToken: {
      type: DataTypes.STRING(255), // ⭐ CORRECTION : DOIT ÊTRE STRING pour stocker la chaîne hexadécimale
      allowNull: true,
      defaultValue: null, // Bonne pratique : défini à null par défaut
    },

  },
  {
    sequelize,
    tableName: "utilisateur",
    timestamps: false,
    idAttribute: 'id_utilisateur',
  }
);

module.exports = Utilisateur;
