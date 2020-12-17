"use strict";

exports.DEFAULT_COMMAND = `--help`;

exports.USER_ARGV_INDEX = 2;

exports.ExitCode = {
  ERROR: 1,
  SUCCESS: 0,
};

exports.HELP_MESSAGE = `
Программа запускает http-сервер и формирует файл с данными для API.

  Гайд:
  service.js <command>

  Команды:
  --version:            выводит номер версии
  --help:               печатает этот текст
  --generate <count>    формирует файл mocks.json
  --server <port>       запускает API-сервер на указаном порту
  --fill <count>        создает sql-файл c запросами для заполнения базы данных
`;

exports.DataFileName = {
  titles: `data/titles.txt`,
  categories: `data/categories.txt`,
  sentences: `data/sentences.txt`,
  comments: `data/comments.txt`,
  firstNames: `data/firstnames.txt`,
  lastNames: `data/lastnames.txt`,
};

exports.DEFAULT_PUBLICATION_AMOUNT = 1;

exports.MAX_PUBLICATION_AMOUNT = 1000;

exports.ArticleRestrict = {
  MAX_ANNOUNCE_SIZE: 2,
  MAX_FULL_DESCR_SIZE: 10,
  MAX_CATEGORY_AMOUND: 5,
};

exports.MOCKS_FILE_NAME = `mocks.json`;

exports.FILL_DB_FILE_NAME = `fill-db.sql`;

exports.PICTURE_FILE_NAME_LIST = [
  `forest`,
  `sea-fullsize`,
  `sea`,
  `skyscraper`,
];

exports.Route = {
  ROOT: `/`,
};

exports.HttpCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

exports.PUBLIC_DIR = `public`;

exports.TEMPLATES_DIR = `templates`;

exports.MAX_ID_LENGTH = 6;

exports.CommentRestrict = {
  MAX_SENTENCES_AMOUNT: 3,
  MAX_COMMENTS_AMOUNT: 5,
};

exports.ResponseMessage = {
  DATA_NOT_FOUND: `Data not found.`,
  API_ROUTE_NOT_FOUND: `Route not found.`,
  PAGE_NOT_FOUND: `Page not found.`,
  BAD_REQUEST: `Invalid data.`,
  INTERNAL_SERVER_ERROR: `Internal server error.`
};

exports.API_PREFIX = `/api`;

exports.DirPath = {
  PUBLIC: `public`,
  TEMPLATES: `templates`,
  UPLOAD: `upload`
};

exports.Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`
};

exports.DBErrorName = {
  FOREIGN_KEY_ERROR: `SequelizeForeignKeyConstraintError`,
  DATABASE_ERROR: `SequelizeDatabaseError`,
  VALIDATION_ERROR: `SequelizeValidationError`
};

exports.PAGINATION_OFFSET = 8;
exports.SEARCH_PAGINATION_OFFSET = 4;
