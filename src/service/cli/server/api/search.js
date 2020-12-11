"use strict";

const {Router} = require(`express`);
const {HttpCode, ResponseMessage} = require(`../../../../constants`);
const {catchAsync, AppError} = require(`../../../../utils`);

module.exports = (app, service) => {
  const route = new Router();

  route.get(
      `/`,
      catchAsync(async (req, res, next) => {
        const {query} = req.query;

        if (!query) {
          return next(
              new AppError(ResponseMessage.BAD_REQUEST, HttpCode.BAD_REQUEST)
          );
        }

        const searchResult = await service.findAll(query);
        return searchResult.length > 0
          ? res.status(HttpCode.OK).json(searchResult)
          : res.status(HttpCode.NOT_FOUND).send(ResponseMessage.DATA_NOT_FOUND);
      })
  );

  app.use(`/search`, route);
};
