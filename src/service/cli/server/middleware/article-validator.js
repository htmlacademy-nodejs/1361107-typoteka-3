"use strict";

const {HttpCode, ResponseMessage} = require(`../../../../constants`);

const articleRequiredKeys = [`announce`, `createdDate`, `сategory`, `fullText`, `title`];
const articleNonRequiredKeys = [`picture`];

module.exports = (req, res, next) => {
  let filteredData;

  filteredData = articleRequiredKeys.reduce((acc, key) => {
    if (req.body[key]) {
      acc[key] = req.body[key];
    }
    return acc;
  }, {});
  const articleKeys = Object.keys(filteredData);
  const isRequiredKeysMatch = articleRequiredKeys.every((key) =>
    articleKeys.includes(key)
  );

  if (!isRequiredKeysMatch) {
    return res.status(HttpCode.BAD_REQUEST).send(ResponseMessage.BAD_REQUEST);
  }

  articleNonRequiredKeys.forEach((key) => {
    filteredData[key] = req.body[key];
  });

  req.body = filteredData;

  return next();
};
