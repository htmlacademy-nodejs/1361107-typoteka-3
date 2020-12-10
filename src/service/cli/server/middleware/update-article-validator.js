"use strict";

const articleRequiredKeys = [
  `announce`,
  `category`,
  `fullText`,
  `title`,
  `picture`
];

module.exports = (req, res, next) => {
  req.body = articleRequiredKeys.reduce((acc, key) => {
    if (req.body[key]) {
      acc[key] = req.body[key];
    }
    return acc;
  }, {});

  return next();
};
