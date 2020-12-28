"use strict";

const Sequelize = require(`sequelize`);

class CategoryService {
  constructor(db) {
    this._db = db;
  }

  async findAll() {
    return await this._db.Category.findAll({
      include: {
        model: this._db.ArticleCategories,
        attributes: []
      },
      attributes: [`id`, `name`, [Sequelize.fn(`count`, Sequelize.col(`categoryId`)), `articleCount`]],
      group: [`Category.id`, `ArticleCategories.categoryId`]
    });
  }
}

module.exports = CategoryService;
