"use strict";

const {formatDate} = require(`../../utils`);
const api = require(`../api`).getAPI();

module.exports = async (req, res) => {
  const categories = await api.getCategories();
  const currentDate = formatDate(new Date()).split(`,`)[0];
  res.render(`new-article`, {
    categories,
    currentDate,
    prevArticleData: req.body || null,
  });
};
