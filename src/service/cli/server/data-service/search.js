"use strict";

const {SEARCH_PAGINATION_OFFSET} = require(`../../../../constants`);
const {getSequelizeQueryOptions} = require(`../../../../utils`);

class SearchService {
  constructor(db) {
    this._db = db;
  }

  async findAll(search, page) {
    const articles = await this._db.Article.findAll(
        getSequelizeQueryOptions(`Article`, this._db)
    );

    const filteredArticles = articles.filter((article) =>
      article.title.toLowerCase().includes(search.toLowerCase())
    );

    const count = filteredArticles.length;

    return {
      count,
      articles: filteredArticles.slice(
          SEARCH_PAGINATION_OFFSET * (page - 1),
          SEARCH_PAGINATION_OFFSET * (page - 1) + SEARCH_PAGINATION_OFFSET
      ),
    };
  }
}

module.exports = SearchService;
