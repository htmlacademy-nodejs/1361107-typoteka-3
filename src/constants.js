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
`;

exports.DataFileName = {
  titles: `data/titles.txt`,
  categories: `data/categories.txt`,
  sentences: `data/sentences.txt`,
};

exports.DEFAULT_PUBLICATION_AMOUNT = 1;

exports.MAX_PUBLICATION_AMOUNT = 1000;

exports.MAX_ANNOUNCE_SIZE = 5;

exports.MAX_FULL_DESCR_SIZE = 30;

exports.MOCKS_FILE_NAME = `mocks.json`;

exports.DEFAULT_API_PORT = 3000;

exports.DEFAULT_RENDER_PORT = 8080;

exports.Route = {
  ROOT: `/`
};

exports.NOT_FOUND_MESSAGE = `Ничего не найдено`;
exports.SERVER_ERROR_MESSAGE = `Ошибка на стороне сервера`;

exports.HttpCode = {
  OK: 200,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
};

exports.PUBLIC_DIR = `public`;

exports.TEMPLATES_DIR = `templates`;

