"use strict";

const {Router} = require(`express`);
const mockData = require(`../../../../../mocks.json`);
const category = require(`./category`);
const {
  CategoryService,
  SearchService,
  CommentsService,
  ArticlesService,
} = require(`../data-service`);
const search = require(`./search`);
const articles = require(`./articles`);

const app = new Router();

category(app, new CategoryService(mockData));
search(app, new SearchService(mockData));
articles(app, new ArticlesService(mockData), new CommentsService());

module.exports = app;
