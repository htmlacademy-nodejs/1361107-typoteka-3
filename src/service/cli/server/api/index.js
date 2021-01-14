"use strict";

const {Router} = require(`express`);
const category = require(`./category`);
const {
  CategoryService,
  SearchService,
  CommentsService,
  ArticlesService,
  UsersService,
} = require(`../data-service`);
const search = require(`./search`);
const articles = require(`./articles`);
const users = require(`./users`);
const {db} = require(`../db/db`);

const app = new Router();

category(app, new CategoryService(db));
search(app, new SearchService(db));
articles(app, {
  articlesService: new ArticlesService(db),
  commentsService: new CommentsService(db),
  categoryService: new CategoryService(db),
  usersService: new UsersService(db),
});
users(app, new UsersService(db));

module.exports = app;
