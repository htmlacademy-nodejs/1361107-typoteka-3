"use strict";

const {HttpCode, ResponseMessage} = require(`../../../../constants`);
const {AppError, catchAsync} = require(`../../../../utils`);

module.exports = (service) => catchAsync(async (req, res, next) => {
  const {articleId} = req.params;

  let article;

  article = await service.findOne(articleId);

  if (!article) {
    return next(new AppError(ResponseMessage.DATA_NOT_FOUND, HttpCode.NOT_FOUND));
  }

  res.locals.article = article;

  return next();
});
