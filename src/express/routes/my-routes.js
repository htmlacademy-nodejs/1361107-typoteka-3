"use strict";

const {Router} = require(`express`);
const {PAGINATION_OFFSET} = require(`../../constants`);
const {catchAsync, formatDate, getPageList} = require(`../../utils`);
const adminRoute = require(`../middleware/admin-route`);
const api = require(`../api`).getAPI();

const myRouter = new Router();

myRouter.get(
    `/`,
    adminRoute,
    catchAsync(async (req, res) => {
      const {user} = req.session;
      const page = Number(req.query.page) || 1;
      const {count, rows: articles} = await api.getArticles(page);
      const maxPage = Math.ceil(count / PAGINATION_OFFSET);
      const pageList = getPageList(page, maxPage);
      res.render(`my`, {articles, formatDate, page, maxPage, pageList, user});
    })
);

myRouter.get(
    `/comments`,
    adminRoute,
    catchAsync(async (req, res) => {
      const {user} = req.session;
      const page = Number(req.query.page) || 1;
      const {count, rows: comments} = await api.getComments(page);
      const maxPage = Math.ceil(count / PAGINATION_OFFSET);
      const pageList = getPageList(page, maxPage);
      res.render(`comments`, {comments, formatDate, user, page, maxPage, pageList});
    })
);

module.exports = myRouter;
