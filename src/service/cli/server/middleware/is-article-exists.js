"use strict";

const { HttpCode, ResponseMessage } = require(`../../../../constants`);

module.exports = (service) => (req, res, next) => {
  const { articleId } = req.params;

  const article = service.findOne(articleId);

  if (!article) {
    return res.status(HttpCode.NOT_FOUND).send(ResponseMessage.DATA_NOT_FOUND);
  }

  res.locals.article = article;

  return next();
};
