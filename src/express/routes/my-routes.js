"use strict";

const {Router} = require(`express`);
const {PAGINATION_OFFSET} = require(`../../constants`);
const {catchAsync, formatDate, getPageList} = require(`../../utils`);
const api = require(`../api`).getAPI();

const myRouter = new Router();

myRouter.get(
    `/`,
    catchAsync(async (req, res) => {
      const page = Number(req.query.page) || 1;
      const {count, rows: articles} = await api.getArticles();
      const maxPage = Math.ceil(count / PAGINATION_OFFSET);
      const pageList = getPageList(page, maxPage);
      res.render(`my`, {articles, formatDate, page, maxPage, pageList});
    })
);

myRouter.get(
    `/comments`,
    catchAsync(async (req, res) => {
      const {rows: articles} = await api.getArticles();
      res.render(`comments`, {articles: articles.slice(0, 3), formatDate});
    })
);

module.exports = myRouter;
