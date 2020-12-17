"use strict";

const {Router} = require(`express`);
const {catchAsync, formatDate} = require(`../../utils`);
const api = require(`../api`).getAPI();

const myRouter = new Router();

myRouter.get(
    `/`,
    catchAsync(async (req, res) => {
      const articles = await api.getArticles();
      res.render(`my`, {articles, formatDate});
    })
);

myRouter.get(
    `/comments`,
    catchAsync(async (req, res) => {
      const articles = await api.getArticles();
      res.render(`comments`, {articles: articles.slice(0, 3), formatDate});
    })
);

module.exports = myRouter;
