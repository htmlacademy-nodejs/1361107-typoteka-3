"use strict";

const {getSequelizeQueryOptions} = require(`../../../../utils`);

class ArticlesService {
  constructor(db) {
    this._db = db;
  }

  async findAll() {
    return await this._db.Article.findAll(getSequelizeQueryOptions(`Article`, this._db));
  }

  async findOne(id) {
    return await this._db.Article.findByPk(id, getSequelizeQueryOptions(`Article`, this._db));
  }

  async create(articleData) {
    const newArticle = await this._db.Article.create(articleData);

    await newArticle.addCategories(articleData.category);

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

    if (articleData.category) {
      await article.setCategories(articleData.category);
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
