"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../../../constants`);
const {catchAsync} = require(`../../../../utils`);
const idValidator = require(`../middleware/id-validator`);
const isCategoryExists = require(`../middleware/is-category-exists`);

module.exports = (app, service) => {
  const route = new Router();

  route.get(
      `/`,
      catchAsync(async (req, res) => {
        const categories = await service.findAll();
        res.status(HttpCode.OK).json(categories);
      })
  );

  route.get(
      `/:categoryId`,
      [idValidator, isCategoryExists(service)],
      catchAsync(async (req, res) => {
        const {category} = res.locals;
        res.status(HttpCode.OK).json(category);
      })
  );

  app.use(`/categories`, route);
};
