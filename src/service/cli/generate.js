"use strict";

const fs = require(`fs`).promises;
const {
  ExitCode,
  MOCKS_FILE_NAME,
  MAX_PUBLICATION_AMOUNT,
  DEFAULT_PUBLICATION_AMOUNT,
  DataFileName,
  MAX_ID_LENGTH,
  CommentRestrict,
  ArticleRestrict,
} = require(`../../constants`);
const chalk = require(`chalk`);
const {nanoid} = require(`nanoid`);
const {getRandomInt, shuffle, readContent, formatDate} = require(`../../utils`);

const getCreatedDate = () => {
  const currentDate = new Date();
  const maxMilliseconds = currentDate.getTime();
  const minMilliseconds = new Date().setMonth(currentDate.getMonth() - 3);

  const createdDateMilliseconds = getRandomInt(
      minMilliseconds,
      maxMilliseconds
  );

  const date = new Date(createdDateMilliseconds);

  return formatDate(date);
};

const generateCommentList = (commentsAmount, comments) => {
  return Array(commentsAmount)
    .fill({}, 0, commentsAmount)
    .map(() => {
      return {
        id: nanoid(MAX_ID_LENGTH),
        text: shuffle(comments)
          .slice(0, getRandomInt(1, CommentRestrict.MAX_SENTENCES_AMOUNT))
          .join(` `),
      };
    });
};

const generateAd = (amount, data) => {
  return Array(amount)
    .fill(0, 0, amount)
    .map(() => {
      return {
        id: nanoid(MAX_ID_LENGTH),
        title: data.titles[getRandomInt(0, data.titles.length - 1)],
        announce: shuffle(data.sentences)
          .slice(0, getRandomInt(1, ArticleRestrict.MAX_ANNOUNCE_SIZE))
          .join(` `),
        fullText: shuffle(data.sentences)
          .slice(0, getRandomInt(1, ArticleRestrict.MAX_FULL_DESCR_SIZE))
          .join(` `),
        createdDate: getCreatedDate(),
        category: shuffle(data.categories).slice(
            0,
            getRandomInt(1, ArticleRestrict.MAX_CATEGORY_AMOUND)
        ),
        comments: generateCommentList(
            getRandomInt(1, CommentRestrict.MAX_COMMENTS_AMOUNT),
            data.comments
        ),
      };
    });
};

module.exports = {
  name: `--generate`,
  run: async (args) => {
    let count = Number.parseInt(args[0], 10);

    const [titles, categories, sentences, comments] = await Promise.all(
        Object.values(DataFileName).map((fileName) => readContent(fileName))
    );

    if (count > MAX_PUBLICATION_AMOUNT) {
      console.log(chalk.red(`Не больше 1000 объявлений`));
      process.exit(ExitCode.SUCCESS);
    }

    count = !count || count <= 0 ? DEFAULT_PUBLICATION_AMOUNT : count;

    const data = JSON.stringify(
        generateAd(count, {titles, categories, sentences, comments})
    );

    try {
      await fs.writeFile(MOCKS_FILE_NAME, data);
      console.log(chalk.green(`Файл успешно создан`));
      process.exit(ExitCode.SUCCESS);
    } catch (error) {
      console.log(chalk.red(`Неудалось записать файл`));
      process.exit(ExitCode.ERROR);
    }
  },
};
