const { Model, DataTypes } = require("sequelize");
const sequelize = require("../Config/sequelize");

class Article extends Model {}

Article.init(
  {
    id_article: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: true
      },
    photo: {
        type: DataTypes.STRING,
        allowNull: true
      },
    prix: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
   
},
    
  {
    sequelize,
    tableName: "article",
    timestamps: false,
  }
);

module.exports = Article;
