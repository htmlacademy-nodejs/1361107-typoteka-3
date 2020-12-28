"use strict";

const {PAGINATION_OFFSET} = require(`../../../../constants`);
const {getSequelizeQueryOptions} = require(`../../../../utils`);

class ArticlesService {
  constructor(db) {
    this._db = db;
  }

  async findAll(page) {
    return await this._db.Article.findAndCountAll({
      ...getSequelizeQueryOptions(`Article`, this._db),
      distinct: true,
      limit: PAGINATION_OFFSET,
      offset: PAGINATION_OFFSET * (page - 1),
    });
  }

  async findOne(id) {
    return await this._db.Article.findByPk(
        id,
        getSequelizeQueryOptions(`Article`, this._db)
    );
  }

  async create(articleData) {
    const newArticle = await this._db.Article.create(articleData);

    await newArticle.addCategories(articleData.categories);

    return newArticle;
  }

  async update(id, articleData) {
    const result = await this._db.Article.update(articleData, {
      where: {
        id,
      },
      returning: true,
    });

    const article = result[1][0];

    if (articleData.categories) {
      await article.setCategories(articleData.categories);
    }

    return article;
  }

  async delete(id) {
    await this._db.Article.destroy({
      where: {
        id,
      },
    });
  }
}

module.exports = ArticlesService;
