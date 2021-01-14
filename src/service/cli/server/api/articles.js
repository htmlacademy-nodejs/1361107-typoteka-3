"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../../../constants`);
const isArticleExists = require(`../middleware/is-article-exists`);
const {catchAsync} = require(`../../../../utils`);
const schemaValidator = require(`../middleware/schema-validator`);
const newArticleSchema = require(`../schemas/new-article`);
const newCommentSchema = require(`../schemas/new-comment`);
const updateArticleSchema = require(`../schemas/update-article`);
const idValidator = require(`../middleware/id-validator`);
const isCategoryExists = require(`../middleware/is-category-exists`);
const isAdmin = require(`../middleware/is-admin`);
const checkUser = require(`../middleware/check-user`);

module.exports = (app, services) => {
  const {
    articlesService,
    commentsService,
    categoryService,
    usersService,
  } = services;

  const route = new Router();

  route.get(
      `/`,
      catchAsync(async (req, res) => {
        const page = Number(req.query.page) || 1;
        const result = await articlesService.findAll(page);
        return res.status(HttpCode.OK).json(result);
      })
  );

  route.get(
      `/:articleId`,
      [idValidator, isArticleExists(articlesService)],
      (req, res) => {
        const {article} = res.locals;

        return res.status(HttpCode.OK).json(article);
      }
  );

  route.post(
      `/`,
      [isAdmin(usersService), schemaValidator(newArticleSchema)],
      catchAsync(async (req, res) => {
        const newArticle = await articlesService.create(req.body);

        return res.status(HttpCode.CREATED).json(newArticle);
      })
  );

  route.put(
      `/:articleId`,
      [
        idValidator,
        schemaValidator(updateArticleSchema),
        isArticleExists(articlesService),
        isAdmin(usersService),
      ],
      catchAsync(async (req, res) => {
        const {articleId} = req.params;
        const updatedArticle = await articlesService.update(articleId, req.body);

        return res.status(HttpCode.OK).json(updatedArticle);
      })
  );

  route.delete(
      `/:articleId`,
      [idValidator, isAdmin(usersService)],
      catchAsync(async (req, res) => {
        const {articleId} = req.params;

        await articlesService.delete(articleId);

        return res.status(HttpCode.NO_CONTENT).json({});
      })
  );

  route.get(
      `/:articleId/comments`,
      [idValidator, isArticleExists(articlesService)],
      catchAsync(async (req, res) => {
        const {article} = res.locals;

        const comments = await commentsService.findAll(article);

        return res.status(HttpCode.OK).json(comments);
      })
  );

  route.delete(
      `/:articleId/comments/:commentId`,
      [idValidator, isArticleExists(articlesService), isAdmin(usersService)],
      catchAsync(async (req, res) => {
        const {article} = res.locals;
        const {commentId} = req.params;

        await commentsService.delete(article, commentId);

        return res.status(HttpCode.NO_CONTENT).json({});
      })
  );

  route.post(
      `/:articleId/comments`,
      [
        idValidator,
        schemaValidator(newCommentSchema),
        isArticleExists(articlesService),
        checkUser(usersService),
      ],
      catchAsync(async (req, res) => {
        const {article} = res.locals;
        const newComment = await commentsService.create(article, req.body);

        return res.status(HttpCode.OK).json(newComment);
      })
  );

  route.get(
      `/category/:categoryId`,
      [idValidator, isCategoryExists(categoryService)],
      catchAsync(async (req, res) => {
        const {categoryId} = req.params;
        const page = Number(req.query.page) || 1;
        const result = await articlesService.findByCategory(page, categoryId);

        return res.status(HttpCode.OK).json(result);
      })
  );

  app.use(`/articles`, route);
};
