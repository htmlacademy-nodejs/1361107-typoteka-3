"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../../../constants`);
const newArticleValidator = require(`../middleware/new-article-validator`);
const commentValidator = require(`../middleware/comment-validator`);
const isArticleExists = require(`../middleware/is-article-exists`);
const updateArticleValidator = require(`../middleware/update-article-validator`);

module.exports = (app, articlesService, commentsService) => {
  const route = new Router();

  route.get(`/`, async (req, res) => {
    const articles = await articlesService.findAll();
    return res.status(HttpCode.OK).json(articles);
  });

  route.get(`/:articleId`, isArticleExists(articlesService), (req, res) => {
    const {article} = res.locals;

    return res.status(HttpCode.OK).json(article);
  });

  route.post(`/`, newArticleValidator, async (req, res) => {
    const newArticle = await articlesService.create(req.body);

    return res.status(HttpCode.CREATED).json(newArticle);
  });

  route.put(`/:articleId`, [updateArticleValidator, isArticleExists(articlesService)], async (req, res) => {
    const {articleId} = req.params;
    const updatedArticle = await articlesService.update(articleId, req.body);

    return res.status(HttpCode.OK).json(updatedArticle);
  });

  route.delete(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    await articlesService.delete(articleId);

    return res.status(HttpCode.NO_CONTENT).json({});
  });

  route.get(`/:articleId/comments`, isArticleExists(articlesService), async (req, res) => {
    const {article} = res.locals;

    const comments = await commentsService.findAll(article);

    return res.status(HttpCode.OK).json(comments);
  });

  route.delete(`/:articleId/comments/:commentId`, isArticleExists(articlesService), async (req, res) => {
    const {article} = res.locals;
    const {commentId} = req.params;

    await commentsService.delete(article, commentId);

    return res.status(HttpCode.NO_CONTENT).json({});
  });

  route.post(`/:articleId/comments`, [commentValidator, isArticleExists(articlesService)], async (req, res) => {
    const {article} = res.locals;
    const newComment = await commentsService.create(article, req.body);

    return res.status(HttpCode.OK).json(newComment);
  });

  app.use(`/articles`, route);
};
