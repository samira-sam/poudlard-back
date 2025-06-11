const { Model,DataTypes } = require('sequelize');
const sequelize = require('../Config/sequelize');

class Vacances extends Model {}

Vacances.init(
  {
    id_vacances: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  info: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  date_debut: {
    type: DataTypes.DATE,
    allowNull: false
  },
  date_fin: {
    type: DataTypes.DATE,
    allowNull: false
  }
    },
  
  {
    sequelize,
    tableName: "vacances",
    timestamps: false,
  }
);

module.exports = Vacances;
