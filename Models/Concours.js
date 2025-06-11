const { DataTypes, Model } = require('sequelize');
const sequelize = require('../Config/sequelize');

class Concours extends Model {}
Concours.init(
   {
  id_concours: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date_fin: {
    type: DataTypes.DATE,
    allowNull: true
  },
   date_debut: {
    type: DataTypes.DATE,
    allowNull: false
  },
  info: {
    type: DataTypes.TEXT
  },

  id_annee_etude: {
  type: DataTypes.INTEGER,
  allowNull: true,
  references: {
    model: 'annee_etude',
    key: 'id_annee_etude'
  }
}

}, {
  sequelize,
  tableName: 'concours',
  timestamps: false
});

module.exports = Concours;
