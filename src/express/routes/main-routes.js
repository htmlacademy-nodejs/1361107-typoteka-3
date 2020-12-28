"use strict";

const {Router} = require(`express`);
const {PAGINATION_OFFSET} = require(`../../constants`);
const {catchAsync, formatDate, getPageList} = require(`../../utils`);
const api = require(`../api`).getAPI();

const mainRouter = new Router();

mainRouter.get(
    `/`,
    catchAsync(async (req, res) => {
      const page = Number(req.query.page) || 1;
      const {count, rows: articles} = await api.getArticles(page);
      const categories = await api.getCategories();
      const maxPage = Math.ceil(count / PAGINATION_OFFSET);
      const pageList = getPageList(page, maxPage);
      res.render(`main`, {
        page,
        maxPage,
        pageList,
        articles,
        formatDate,
        categories,
      });
    })
);

module.exports = mainRouter;
