"use strict";

const CategoryService = require(`./category`);
const ArticlesService = require(`./articles`);
const SearchService = require(`./search`);
const CommentsService = require(`./comments`);
const UsersService = require(`./users`);

module.exports = {
  CategoryService,
  ArticlesService,
  SearchService,
  CommentsService,
  UsersService,
};
