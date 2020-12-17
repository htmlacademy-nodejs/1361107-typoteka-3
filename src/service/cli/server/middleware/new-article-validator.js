"use strict";

const {HttpCode, ResponseMessage} = require(`../../../../constants`);
const {AppError} = require(`../../../../utils`);

const articleRequiredKeys = [
  `announce`,
  `category`,
  `fullText`,
  `title`,
  `userId`
];
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
    return next(new AppError(ResponseMessage.BAD_REQUEST, HttpCode.BAD_REQUEST));
  }

  articleNonRequiredKeys.forEach((key) => {
    filteredData[key] = req.body[key];
  });

  req.body = filteredData;

  return next();
};
