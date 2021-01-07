"use strict";

const {Router} = require(`express`);
const category = require(`./category`);
const {
  CategoryService,
  SearchService,
  CommentsService,
  ArticlesService,
} = require(`../data-service`);
const search = require(`./search`);
const articles = require(`./articles`);
const {db} = require(`../db/db`);

const app = new Router();

category(app, new CategoryService(db));
search(app, new SearchService(db));
articles(app, {
  articlesService: new ArticlesService(db),
  commentsService: new CommentsService(db),
  categoryService: new CategoryService(db),
});

module.exports = app;
