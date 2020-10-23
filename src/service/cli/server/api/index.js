"use strict";

const {Router} = require(`express`);
const mockData = require(`../../../../../mocks.json`);
const category = require(`./category`);
const {
  CategoryService,
} = require(`../data-service`);

const app = new Router();

category(app, new CategoryService(mockData));

module.exports = app;
