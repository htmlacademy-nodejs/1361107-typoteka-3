'use strict';

const {Model, DataTypes} = require(`sequelize`);

module.exports = (sequelize) => {
  class Article extends Model {}
  Article.init({
    title: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    announce: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    fullText: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
  }, {
    sequelize,
    timestamps: true,
    paranoid: false,
  });

  return Article;
};
