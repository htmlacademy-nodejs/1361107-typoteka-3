"use strict";

const {ResponseMessage, HttpCode} = require(`../../../../constants`);
const {AppError} = require(`../../../../utils`);

module.exports = (req, res, next) => {
  const {articleId, commentId} = req.params;

  for (const id of [articleId, commentId]) {
    if (id && isNaN(Number(id))) {
      return next(
          new AppError(ResponseMessage.BAD_REQUEST, HttpCode.BAD_REQUEST)
      );
    }
  }

  return next();
};
