"use strict";

const express = require(`express`);
const path = require(`path`);
const {
  ExitCode,
  HttpCode,
  DirPath,
  ResponseMessage,
} = require(`../constants`);
const mainRouter = require(`./routes/main-routes`);
const registerRouter = require(`./routes/register-routes`);
const loginRouter = require(`./routes/login-routes`);
const myRouter = require(`./routes/my-routes`);
const articlesRouter = require(`./routes/articles-routes`);
const searchRouter = require(`./routes/search-routes`);
const categoriesRouter = require(`./routes/categories-routes`);
const chalk = require(`chalk`);
const config = require(`../config`);

const app = express();

app.use(express.static(path.resolve(__dirname, DirPath.PUBLIC)));
app.use(express.static(path.resolve(__dirname, DirPath.UPLOAD)));
app.set(`views`, path.resolve(__dirname, DirPath.TEMPLATES));
app.set(`view engine`, `pug`);

app.use(`/`, mainRouter);
app.use(`/register`, registerRouter);
app.use(`/login`, loginRouter);
app.use(`/my`, myRouter);
app.use(`/articles`, articlesRouter);
app.use(`/search`, searchRouter);
app.use(`/categories`, categoriesRouter);

app.use((req, res) =>
  res
    .status(HttpCode.NOT_FOUND)
    .render(`errors/400`, {
      statusCode: HttpCode.NOT_FOUND,
      message: ResponseMessage.PAGE_NOT_FOUND,
    })
);
app.use((err, _req, res, _next) => {
  console.trace(err);
  const statusCode = err.response
    ? err.response.status
    : HttpCode.INTERNAL_SERVER_ERROR;
  if (statusCode < 500) {
    return res
      .status(err.response.status)
      .render(`errors/400`, {statusCode, message: err.response.data.message});
  }
  return res.status(statusCode).render(`errors/500`);
});

app.listen(config.FRONT_PORT, (err) => {
  if (err) {
    console.log(chalk.red(`Неудалось запустить сервер`));
    process.exit(ExitCode.ERROR);
  }

  console.log(chalk.gray(`Сервер запущен, порт: ${config.FRONT_PORT}`));
});
