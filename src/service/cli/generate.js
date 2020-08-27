"use strict";

const fs = require(`fs`);
const {
  ExitCode,
  MOCKS_FILE_NAME,
  MAX_ANNOUNCE_SIZE,
  MAX_FULL_DESCR_SIZE,
  MAX_PUBLICATION_AMOUNT,
  DEFAULT_PUBLICATION_AMOUNT,
} = require(`../../constants`);
const titles = require(`../../../data/titles.json`);
const categories = require(`../../../data/categories.json`);
const descriptions = require(`../../../data/descriptions.json`);
const {getRandomInt, shuffle} = require(`../../utils`);

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

const generateAd = (amount) => {
  return Array(amount)
    .fill(0, 0, amount)
    .map(() => {
      return {
        title: titles[getRandomInt(0, titles.length - 1)],
        announce: shuffle(descriptions)
          .slice(0, getRandomInt(1, MAX_ANNOUNCE_SIZE))
          .join(` `),
        fullText: shuffle(descriptions)
          .slice(0, getRandomInt(1, MAX_FULL_DESCR_SIZE))
          .join(` `),
        createdDate: getCreatedDate(),
        сategory: shuffle(categories).slice(
            0,
            getRandomInt(1, categories.length)
        ),
      };
    });
};

module.exports = {
  name: `--generate`,
  run(args) {
    let count = Number.parseInt(args[0], 10);

    if (count > MAX_PUBLICATION_AMOUNT) {
      console.log(`Не больше 1000 объявлений`);
      process.exit(ExitCode.SUCCESS);
    }

    count = !count || count <= 0 ? DEFAULT_PUBLICATION_AMOUNT : count;

    const data = JSON.stringify(generateAd(count));

    fs.writeFile(MOCKS_FILE_NAME, data, (err) => {
      if (err) {
        console.log(`Неудалось записать файл`);
        process.exit(ExitCode.ERROR);
      }
      console.log(`Файл успешно создан`);
      process.exit(ExitCode.SUCCESS);
    });
  },
};
