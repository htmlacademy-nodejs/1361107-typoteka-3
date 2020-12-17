"use strict";

const {Router} = require(`express`);
const {HttpCode, ResponseMessage} = require(`../../../../constants`);
const {catchAsync, AppError} = require(`../../../../utils`);

module.exports = (app, service) => {
  const route = new Router();

  route.get(
      `/`,
      catchAsync(async (req, res, next) => {
        let {search, page} = req.query;
        page = page ? +page : 1;

        if (!search) {
          return next(
              new AppError(ResponseMessage.BAD_REQUEST, HttpCode.BAD_REQUEST)
          );
        }

        const result = await service.findAll(search, page);
        return result.articles.length > 0
          ? res.status(HttpCode.OK).json(result)
          : res.status(HttpCode.NOT_FOUND).send(ResponseMessage.DATA_NOT_FOUND);
      })
  );

  app.use(`/search`, route);
};
