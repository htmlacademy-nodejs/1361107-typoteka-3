"use strict";

const fs = require(`fs`).promises;
const {Router} = require(`express`);
const {MOCKS_FILE_NAME, HttpCode, SERVER_ERROR_MESSAGE} = require(`../../../../constants`);

const articlesRouter = new Router();

articlesRouter.get(`/`, async (req, res) => {
  try {
    const mocks = await fs.readFile(MOCKS_FILE_NAME);
    const articles = JSON.parse(mocks);
    res.json(articles);
  } catch (error) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).send(SERVER_ERROR_MESSAGE);
  }
});

module.exports = articlesRouter;
