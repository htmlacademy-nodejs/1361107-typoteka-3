"use strict";

const {Model} = require(`sequelize`);

module.exports = (sequelize) => {
  class ArticleCategories extends Model {}
  ArticleCategories.init(
      {},
      {
        sequelize,
        indexes: [{
          using: `BTREE`,
          fields: [`categoryId`]
        }, {
          using: `BTREE`,
          fields: [`articleId`]
        }],
        timestamps: false,
        paranoid: false,
        tableName: `Article_Categories`,
      }
  );

  return ArticleCategories;
};
