const { Model, DataTypes } = require("sequelize");
const sequelize = require("../Config/sequelize");

class AnneeEtudeMatiere extends Model {}

AnneeEtudeMatiere.init(
 {
      id_annee_etude: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: "annee_etude",
          key: "id_annee_etude"
        },
      },
      id_matiere: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: "matiere",
          key: "id_matiere"
        },
      },
    },
  {
    sequelize,
    tableName: "annee_etude_matiere",
    timestamps: false,
  }
);

module.exports = AnneeEtudeMatiere;
