"use strict";

const {Router} = require(`express`);
const {catchAsync, formatDate} = require(`../../utils`);
const api = require(`../api`).getAPI();

const searchRouter = new Router();

searchRouter.get(
    `/`,
    catchAsync(async (req, res) => {
      const {search} = req.query;
      try {
        const results = await api.search(search);
        res.render(`search`, {
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
