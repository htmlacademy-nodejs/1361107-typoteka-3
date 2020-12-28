"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../../../constants`);
const {catchAsync} = require(`../../../../utils`);
const idValidator = require(`../middleware/id-validator`);

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
      idValidator,
      catchAsync(async (req, res) => {
        const {categoryId} = req.params;
        const category = await service.findOne(categoryId);
        res.status(HttpCode.OK).json(category);
      })
  );

  app.use(`/categories`, route);
};
