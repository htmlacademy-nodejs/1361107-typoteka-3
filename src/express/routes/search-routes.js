"use strict";

const {Router} = require(`express`);
const {SEARCH_PAGINATION_OFFSET} = require(`../../constants`);
const {catchAsync, formatDate, getPageList} = require(`../../utils`);
const api = require(`../api`).getAPI();

const searchRouter = new Router();

searchRouter.get(
    `/`,
    catchAsync(async (req, res) => {
      let {page, search} = req.query;
      page = Number(page) || 1;
      try {
        const {count, articles: results} = await api.search(search, page);
        const maxPage = Math.ceil(count / SEARCH_PAGINATION_OFFSET);
        const pageList = getPageList(page, maxPage);
        res.render(`search`, {
          page,
          maxPage,
          pageList,
          results,
          search,
          formatDate
        });
      } catch (error) {
        res.render(`search`, {
          results: [],
          search,
          formatDate
        });
      }
    })
);

module.exports = searchRouter;
