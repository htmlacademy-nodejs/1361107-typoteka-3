"use strict";

const {Router} = require(`express`);
const mockData = require(`../../../../../mocks.json`);
const category = require(`./category`);
const {
  CategoryService,
} = require(`../data-service`);
const search = require(`./search`);
const SearchService = require(`../data-service/search`);

const app = new Router();

category(app, new CategoryService(mockData));
search(app, new SearchService(mockData));

module.exports = app;
