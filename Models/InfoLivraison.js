const { Model,DataTypes } = require('sequelize');
const sequelize = require('../Config/sequelize');

class InfoLivraison extends Model {}

InfoLivraison.init(
  {
    id_livraison: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    
      info: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
   
 
  {
    sequelize,
    tableName: "info_livraison",
    timestamps: false,
  }
);
module.exports = InfoLivraison;