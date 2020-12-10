"use strict";

const {getSequelizeQueryOptions} = require(`../../../../utils`);

class SearchService {
  constructor(db) {
    this._db = db;
  }

  async findAll(searchText) {
    const articles = await this._db.Article.findAll(
        getSequelizeQueryOptions(`Article`, this._db)
    );

    return articles.filter((article) =>
      article.title.toLowerCase().includes(searchText.toLowerCase())
    );
  }
}

module.exports = SearchService;
