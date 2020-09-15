"use strict";

const express = require(`express`);
const {DEFAULT_RENDER_PORT, ExitCode, HttpCode, NOT_FOUND_MESSAGE, SERVER_ERROR_MESSAGE} = require(`../constants`);
const mainRouter = require(`./routes/main-routes`);
const registerRouter = require(`./routes/register-routes`);
const loginRouter = require(`./routes/login-routes`);
const myRouter = require(`./routes/my-routes`);
const articlesRouter = require(`./routes/articles-routes`);
const searchRouter = require(`./routes/search-routes`);
const categoriesRouter = require(`./routes/categories-routes`);
const chalk = require(`chalk`);

const app = express();

app.use(`/`, mainRouter);
app.use(`/register`, registerRouter);
app.use(`/login`, loginRouter);
app.use(`/my`, myRouter);
app.use(`/articles`, articlesRouter);
app.use(`/search`, searchRouter);
app.use(`/categories`, categoriesRouter);

app.use((req, res) => res.status(HttpCode.NOT_FOUND).send(NOT_FOUND_MESSAGE));
app.use((err, req, res) => res.status(HttpCode.INTERNAL_SERVER_ERROR).send(SERVER_ERROR_MESSAGE));

app.listen(DEFAULT_RENDER_PORT, (err) => {
  if (err) {
    console.log(chalk.red(`Неудалось запустить сервер`));
    process.exit(ExitCode.ERROR);
  }

  console.log(chalk.gray(`Сервер запущен, порт: ${DEFAULT_RENDER_PORT}`));
});
