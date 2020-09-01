"use strict";

const fs = require(`fs`).promises;
const {
  ExitCode,
  MOCKS_FILE_NAME,
  MAX_ANNOUNCE_SIZE,
  MAX_FULL_DESCR_SIZE,
  MAX_PUBLICATION_AMOUNT,
  DEFAULT_PUBLICATION_AMOUNT,
  DataFileName,
} = require(`../../constants`);
const chalk = require(`chalk`);
const {getRandomInt, shuffle, readContent} = require(`../../utils`);

const getCreatedDate = () => {
  const currentDate = new Date();
  const maxMilliseconds = currentDate.getTime();
  const minMilliseconds = new Date().setMonth(currentDate.getMonth() - 3);

  const createdDateMilliseconds = getRandomInt(
      minMilliseconds,
      maxMilliseconds
  );

  return new Date(createdDateMilliseconds).toLocaleString();
};

const generateAd = (amount, data) => {
  return Array(amount)
    .fill(0, 0, amount)
    .map(() => {
      return {
        title: data[getRandomInt(0, data.titles.length - 1)],
        announce: shuffle(data.sentences)
          .slice(0, getRandomInt(1, MAX_ANNOUNCE_SIZE))
          .join(` `),
        fullText: shuffle(data.sentences)
          .slice(0, getRandomInt(1, MAX_FULL_DESCR_SIZE))
          .join(` `),
        createdDate: getCreatedDate(),
        сategory: shuffle(data.categories).slice(
            0,
            getRandomInt(1, data.categories.length)
        ),
      };
    });
};

module.exports = {
  name: `--generate`,
  run: async (args) => {
    let count = Number.parseInt(args[0], 10);

    const [titles, categories, sentences] = await Promise.all(
        Object.values(DataFileName).map((fileName) => readContent(fileName))
    );

    if (count > MAX_PUBLICATION_AMOUNT) {
      console.log(chalk.red(`Не больше 1000 объявлений`));
      process.exit(ExitCode.SUCCESS);
    }

    count = !count || count <= 0 ? DEFAULT_PUBLICATION_AMOUNT : count;

    const data = JSON.stringify(generateAd(count, {titles, categories, sentences}));

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
