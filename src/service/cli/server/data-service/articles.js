"use strict";

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../../../constants`);

class ArticlesService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll() {
    return this._articles;
  }

  findOne(id) {
    return this._articles.find((article) => article.id === id);
  }

  create(articleData) {
    const newArticle = {id: nanoid(MAX_ID_LENGTH), comments: [], ...articleData};

    this._articles.push(newArticle);

    return newArticle;
  }

  update(id, articleData) {
    const oldArticleIndex = this._articles.findIndex((article) => article.id === id);

    this._articles[oldArticleIndex] = {...this._articles[oldArticleIndex], ...articleData};

    return this._articles[oldArticleIndex];
  }

  delete(id) {
    const deletingArticleIndex = this._articles.findIndex((article) => article.id === id);

    if (deletingArticleIndex === -1) {
      return;
    }

    this._articles.splice(deletingArticleIndex, 1);
  }
}

module.exports = ArticlesService;
