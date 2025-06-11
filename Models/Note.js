const { Model, DataTypes } = require("sequelize");
const sequelize = require("../Config/sequelize");

class Note extends Model {}

Note.init(
  {
    id_note: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    valeur: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    date_note: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    commentaire: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    id_eleve: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "eleve",
        key: "id_eleve",
      },
    },
    id_matiere: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "matiere",
        key: "id_matiere",
      },
    },
    id_professeur: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "professeur",
        key: "id_professeur",
      },
    },
  },
  {
    sequelize,
    tableName: "note",
    timestamps: false,
  }
);

module.exports = Note;
