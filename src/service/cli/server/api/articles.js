"use strict";

const {Router} = require(`express`);
const {HttpCode, ResponseMessage} = require(`../../../../constants`);
const commentValidator = require(`../middleware/comment-validator`);
const isArticleExists = require(`../middleware/is-article-exists`);
const updateArticleValidator = require(`../middleware/update-article-validator`);
const {catchAsync, AppError} = require(`../../../../utils`);
const schemaValidator = require(`../middleware/schema-validator`);
const newArticleSchema = require(`../schemas/new-article`);

module.exports = (app, articlesService, commentsService) => {
  const route = new Router();

  route.get(
      `/`,
      catchAsync(async (req, res) => {
        const page = Number(req.query.page) || 1;
        const result = await articlesService.findAll(page);
        return res.status(HttpCode.OK).json(result);
      })
  );

  route.get(`/:articleId`, isArticleExists(articlesService), (req, res) => {
    const {article} = res.locals;

    return res.status(HttpCode.OK).json(article);
  });

  route.post(
      `/`,
      schemaValidator(newArticleSchema),
      catchAsync(async (req, res) => {
        const newArticle = await articlesService.create(req.body);

        return res.status(HttpCode.CREATED).json(newArticle);
      })
  );

  route.put(
      `/:articleId`,
      [updateArticleValidator, isArticleExists(articlesService)],
      catchAsync(async (req, res) => {
        const {articleId} = req.params;
        const updatedArticle = await articlesService.update(articleId, req.body);

        return res.status(HttpCode.OK).json(updatedArticle);
      })
  );

  route.delete(
      `/:articleId`,
      catchAsync(async (req, res, next) => {
        const {articleId} = req.params;

        if (isNaN(Number(articleId))) {
          return next(
              new AppError(ResponseMessage.BAD_REQUEST, HttpCode.BAD_REQUEST)
          );
        }
        await articlesService.delete(articleId);

        return res.status(HttpCode.NO_CONTENT).json({});
      })
  );

  route.get(
      `/:articleId/comments`,
      isArticleExists(articlesService),
      catchAsync(async (req, res) => {
        const {article} = res.locals;

        const comments = await commentsService.findAll(article);

        return res.status(HttpCode.OK).json(comments);
      })
  );

  route.delete(
      `/:articleId/comments/:commentId`,
      isArticleExists(articlesService),
      catchAsync(async (req, res, next) => {
        const {article} = res.locals;
        const {commentId} = req.params;

        if (isNaN(Number(commentId))) {
          return next(
              new AppError(ResponseMessage.BAD_REQUEST, HttpCode.BAD_REQUEST)
          );
        }

        await commentsService.delete(article, commentId);

        return res.status(HttpCode.NO_CONTENT).json({});
      })
  );

  route.post(
      `/:articleId/comments`,
      [commentValidator, isArticleExists(articlesService)],
      catchAsync(async (req, res) => {
        const {article} = res.locals;
        const newComment = await commentsService.create(article, req.body);

        return res.status(HttpCode.OK).json(newComment);
      })
  );

  app.use(`/articles`, route);
};
