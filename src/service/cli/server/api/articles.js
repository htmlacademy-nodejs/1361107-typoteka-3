"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../../../constants`);
const articleValidator = require(`../middleware/article-validator`);
const commentValidator = require(`../middleware/comment-validator`);
const isArticleExists = require(`../middleware/is-article-exists`);

module.exports = (app, articlesService, commentsService) => {
  const route = new Router();

  route.get(`/`, (req, res) => {
    const articles = articlesService.findAll();
    return res.status(HttpCode.OK).json(articles);
  });

  route.get(`/:articleId`, isArticleExists(articlesService), (req, res) => {
    const {article} = res.locals;

    return res.status(HttpCode.OK).json(article);
  });

  route.post(`/`, articleValidator, (req, res) => {
    const newArticle = articlesService.create(req.body);

    return res.status(HttpCode.CREATED).json(newArticle);
  });

  route.put(`/:articleId`, [articleValidator, isArticleExists(articlesService)], (req, res) => {
    const {articleId} = req.params;
    const updatedArticle = articlesService.update(articleId, req.body);

    return res.status(HttpCode.OK).json(updatedArticle);
  });

  route.delete(`/:articleId`, isArticleExists(articlesService), (req, res) => {
    const {articleId} = req.params;
    articlesService.delete(articleId);

    return res.status(HttpCode.NO_CONTENT);
  });

  route.get(`/:articleId/comments`, isArticleExists(articlesService), (req, res) => {
    const {article} = res.locals;

    const comments = commentsService.findAll(article);

    return res.status(HttpCode.OK).json(comments);
  });

  route.delete(`/:articleId/comments/:commentId`, isArticleExists(articlesService), (req, res) => {
    const {article} = res.locals;
    const {commentId} = req.params;

    commentsService.delete(article, commentId);

    return res.status(HttpCode.NO_CONTENT);
  });

  route.post(`/:articleId/comments`, [commentValidator, isArticleExists(articlesService)], (req, res) => {
    const {article} = res.locals;
    const newComment = commentsService.create(article, req.body);

    return res.status(HttpCode.OK).json(newComment);
  });

  app.use(`/articles`, route);
};
