const { Model,DataTypes } = require('sequelize');
const sequelize = require('../Config/sequelize');




class Buse extends Model {}

Buse.init(
  {
    id_buse: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    info: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
     
    },
  },
  {
    sequelize,
    tableName: "buse",
    timestamps: false,
  }
);

module.exports = Buse;
