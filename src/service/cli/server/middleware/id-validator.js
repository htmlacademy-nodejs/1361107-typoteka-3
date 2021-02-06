"use strict";

const {ResponseMessage, HttpCode} = require(`../../../../constants`);
const {AppError} = require(`../../../../utils`);

module.exports = (req, res, next) => {
  const {articleId, commentId, categoryId} = req.params;

  for (const el of [articleId, commentId, categoryId]) {
    if (el && isNaN(Number(el))) {
      return next(
          new AppError(ResponseMessage.BAD_REQUEST, HttpCode.BAD_REQUEST)
      );
    }
  }

  return next();
};
