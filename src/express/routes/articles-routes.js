"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const api = require(`../api`).getAPI();

const articlesRouter = new Router();

articlesRouter.get(`/category/:id`, (req, res) =>
  res.render(`articles-by-category`)
);
articlesRouter.get(`/add`, (req, res) => res.render(`new-article`));
articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  try {
    const [article, categories] = await Promise.all([
      api.getArticle(id),
      api.getCategories(),
    ]);
    res.render(`edit-article`, {article, categories});
  } catch (error) {
    res.status(HttpCode.NOT_FOUND).render(`errors/400`);
  }
});
articlesRouter.get(`/:id`, (req, res) => res.render(`article`));

module.exports = articlesRouter;
