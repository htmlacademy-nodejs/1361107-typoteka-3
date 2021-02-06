"use strict";

const chalk = require(`chalk`);
const {PICTURE_FILE_NAME_LIST} = require(`./constants`);
const fs = require(`fs`).promises;

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
exports.getRandomInt = getRandomInt;

exports.shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [array[i], array[randomPosition]] = [
      array[randomPosition],
      array[i],
    ];
  }

  return array;
};

exports.readContent = async (fileName) => {
  try {
    const list = await fs.readFile(`${fileName}`, `utf8`);
    const content = list
      .split(`\n`)
      .map((string) => string.replace(/(\r\n|\n|\r)/gm, ``));
    return content;
  } catch (error) {
    console.log(chalk.red(`Не удалось прочитать файл с данными`));
    return [];
  }
};

exports.formatDate = (date) => {
  if (typeof date === `string`) {
    date = new Date(date);
  }
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();

  return `${day}.${month}.${year}, ${hours}:${minutes}`;
};

exports.getTime = (date) => {
  const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();

  return `${hours}:${minutes}`;
};

exports.buildQueryString = (o) => {
  const keys = Object.keys(o);

  let queryString = `?`;

  if (keys.length === 0) {
    return queryString;
  }

  keys.forEach((key) => {
    let value = o[key];
    let arrayString = ``;
    if (Array.isArray(value)) {
      value.forEach((arrayValue) => {
        arrayString = `${arrayString}${key}=${arrayValue}&`;
      });
      queryString = `${queryString}${arrayString}`;
      return;
    }
    queryString = `${queryString}${key}=${value}&`;
  });

  return queryString.slice(0, -1);
};

exports.getAvatar = () => `avatar-${getRandomInt(1, 5)}.png`;

exports.getPictureFileName = () =>
  `${
    PICTURE_FILE_NAME_LIST[
      getRandomInt(0, PICTURE_FILE_NAME_LIST.length - 1)
    ]
  }@1x.jpg`;

exports.getCreatedDate = () => {
  const currentDate = new Date();
  const maxMilliseconds = currentDate.getTime();
  const minMilliseconds = new Date().setMonth(currentDate.getMonth() - 3);

  const createdDateMilliseconds = getRandomInt(
      minMilliseconds,
      maxMilliseconds
  );

  const date = new Date(createdDateMilliseconds);

  return date.toISOString();
};

exports.getSequelizeQueryOptions = (model, db) => {
  const options = {
    Article: {
      include: [
        {
          model: db.Comment,
          as: `comments`,
          attributes: {exclude: [`userId`, `articleId`]},
          include: {
            model: db.User,
            as: `user`,
            attributes: [`id`, `firstName`, `lastName`, `email`, `avatar`],
          },
        },
        {
          model: db.Category,
          as: `categories`,
          through: {
            attributes: [],
          },
        },
      ],
    },
    Comment: {
      attributes: {exclude: [`userId`, `articleId`]},
      include: {
        model: db.User,
        as: `user`,
        attributes: [`id`, `firstName`, `lastName`, `email`, `avatar`],
      },
    },
    User: {
      attributes: [`id`, `firstName`, `lastName`, `email`, `avatar`],
    }
  };

  return options[model];
};


exports.catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};

class AppError extends Error {
  constructor(message, statusCode, details) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    if (details) {
      this.details = details;
    }

    Error.captureStackTrace(this, this.constructor);
  }
}

exports.AppError = AppError;

exports.getCardColor = () => {
  let number = getRandomInt(1, 16);

  return number < 10 ? `0${number}` : number;
};

exports.getPageList = (page, maxPage) => {
  let pageList = [];
  if (maxPage <= 5) {
    pageList = Array(maxPage)
    .fill({}, 0, maxPage)
    .map((el, i) => i + 1);
    return pageList;
  }

  if (page === 1 || page === 2) {
    pageList = [1, 2, 3, 4, 5];
    return pageList;
  }

  if (page + 2 > maxPage) {
    pageList = [maxPage - 4, maxPage - 3, maxPage - 2, maxPage - 1, maxPage];
    return pageList;
  }
  pageList = [page - 2, page - 1, page, page + 1, page + 2];
  return pageList;
};
