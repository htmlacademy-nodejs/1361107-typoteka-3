"use strict";

const {Router} = require(`express`);
const {catchAsync, formatDate} = require(`../../utils`);
const api = require(`../api`).getAPI();

const mainRouter = new Router();

mainRouter.get(
    `/`,
    catchAsync(async (req, res) => {
      const articles = await api.getArticles();
      res.render(`main`, {articles, formatDate});
    })
);

module.exports = mainRouter;
