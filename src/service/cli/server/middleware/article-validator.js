"use strict";

const {HttpCode, ResponseMessage} = require(`../../../../constants`);

const articleRequiredKeys = [`announce`, `createdDate`, `сategory`, `fullText`];

module.exports = (req, res, next) => {
  req.body = articleRequiredKeys.reduce((acc, key) => {
    if (req.body[key]) {
      acc[key] = req.body[key];
    }
    return acc;
  }, {});
  const articleKeys = Object.keys(req.body);
  const isKeysMatch = articleRequiredKeys.every((key) =>
    articleKeys.includes(key)
  );

  if (!isKeysMatch) {
    return res.status(HttpCode.BAD_REQUEST).send(ResponseMessage.BAD_REQUEST);
  }

  return next();
};
