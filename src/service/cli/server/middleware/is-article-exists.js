"use strict";

const {HttpCode, ResponseMessage} = require(`../../../../constants`);

module.exports = (service) => async (req, res, next) => {
  const {articleId} = req.params;

  let article;

  try {
    article = await service.findOne(articleId);
  } catch (error) {
    return res.status(HttpCode.BAD_REQUEST).send(ResponseMessage.BAD_REQUEST);
  }

  if (!article) {
    return res.status(HttpCode.NOT_FOUND).send(ResponseMessage.DATA_NOT_FOUND);
  }

  res.locals.article = article;

  return next();
};
