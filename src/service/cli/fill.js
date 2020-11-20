"use strict";

const {
  FILL_DB_FILE_NAME,
  MAX_ID_LENGTH,
  CommentRestrict,
  MAX_PUBLICATION_AMOUNT,
  DEFAULT_PUBLICATION_AMOUNT,
  ArticleRestrict,
} = require(`../../constants`);
const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const {
  ExitCode,
  DataFileName,
} = require(`../../constants`);
const {readContent, getRandomInt, shuffle, getCreatedDate, getAvatar, getPictureFileName} = require(`../../utils`);
const {nanoid} = require(`nanoid`);

const generateInsertQuery = (tableName, values) => {
  return `INSERT INTO ${tableName} VALUES ${values};`;
};

const generateCategoriesQuery = (categoryList) => {
  const categories = categoryList.map((category) => `(DEFAULT, '${category}')`);

  return generateInsertQuery(`categories`, categories.join(`,`));
};

const generateUsersQuery = (usersCount, firstNames, lastNames) => {
  const users = Array(usersCount)
    .fill(0, 0, usersCount)
    .map(() => {
      const firstName = firstNames[getRandomInt(0, firstNames.length - 1)];
      const lastName = lastNames[getRandomInt(0, lastNames.length - 1)];
      const email = `${nanoid(MAX_ID_LENGTH)}@mail.ru`;
      return `(DEFAULT, '${firstName}', '${lastName}', '${email}', 'password', '${getAvatar()}')`;
    });

  return generateInsertQuery(`users`, users.join(`,`));
};

const generateCommentsQuery = (commentsCount, commentSentenceList) => {
  const generateCommentList = (commentsAmount, comments) => {
    return Array(commentsAmount)
      .fill({}, 0, commentsAmount)
      .map(() => {
        return shuffle(comments)
          .slice(0, getRandomInt(1, CommentRestrict.MAX_SENTENCES_AMOUNT))
          .join(` `);
      });
  };

  let currentOfferId = 1;
  let currentOfferCount = 0;

  const comments = generateCommentList(commentsCount, commentSentenceList).map(
      (comment) => {
        const userId = getRandomInt(1, commentsCount / 2);
        if (currentOfferCount === 2) {
          currentOfferCount = 0;
          currentOfferId++;
        }
        currentOfferCount++;
        return `(DEFAULT, '${comment}', ${userId}, ${currentOfferId})`;
      }
  );

  return generateInsertQuery(`comments`, comments.join(`,`));
};

const generateArticlesQuery = (articlesCount, titleList, sentencesList) => {
  const articles = Array(articlesCount).fill({}, 0, articlesCount).map(() => {
    const title = titleList[getRandomInt(0, titleList.length - 1)];
    const picture = getPictureFileName();
    const announce = shuffle(sentencesList)
      .slice(0, getRandomInt(1, ArticleRestrict.MAX_ANNOUNCE_SIZE))
      .join(` `);
    const fullText = shuffle(sentencesList)
      .slice(0, getRandomInt(1, ArticleRestrict.MAX_FULL_DESCR_SIZE))
      .join(` `);
    const owner = getRandomInt(1, articlesCount);
    const createdDate = getCreatedDate();

    return `(DEFAULT, '${title}', '${announce}', '${picture}', '${fullText}', ${owner}, '${createdDate}')`;
  });

  return generateInsertQuery(`articles`, articles.join(`,`));
};

const generateArticlesCategoriesQuery = (articlesCount, categoryListLength) => {
  const values = [];

  for (let articleId = 1; articleId <= articlesCount; articleId++) {
    const categoriesCount = getRandomInt(1, categoryListLength);

    const articleCategories = [];

    for (let j = 1; j <= categoriesCount; j++) {
      let categoryId = getRandomInt(1, categoryListLength);

      while (articleCategories.includes(categoryId)) {
        categoryId = getRandomInt(1, categoryListLength);
      }

      articleCategories.push(categoryId);
      values.push(`(${articleId}, ${categoryId})`);
    }
  }

  return generateInsertQuery(`articles_categories`, values.join(`, `));
};

const generateFile = (articlesCount, dataList) => {
  const commentsCount = articlesCount * 2;
  const usersCount = articlesCount;

  const queryList = [];

  queryList.push(generateCategoriesQuery(dataList.categories));
  queryList.push(
      generateUsersQuery(usersCount, dataList.firstNames, dataList.lastNames)
  );
  queryList.push(generateArticlesQuery(articlesCount, dataList.titles, dataList.sentences));
  queryList.push(generateCommentsQuery(commentsCount, dataList.comments));
  queryList.push(generateArticlesCategoriesQuery(articlesCount, dataList.categories.length));

  return queryList.join(` `);
};

module.exports = {
  name: `--fill`,
  run: async (args) => {
    let count = Number.parseInt(args[0], 10);

    const [
      titles,
      categories,
      sentences,
      comments,
      firstNames,
      lastNames,
    ] = await Promise.all(
        Object.values(DataFileName).map((fileName) => readContent(fileName))
    );

    if (count > MAX_PUBLICATION_AMOUNT) {
      console.log(chalk.red(`Не больше 1000 публикаций`));
      process.exit(ExitCode.SUCCESS);
    }

    count = !count || count <= 0 ? DEFAULT_PUBLICATION_AMOUNT : count;

    const data = generateFile(count, {
      titles,
      categories,
      sentences,
      comments,
      firstNames,
      lastNames,
    });

    try {
      await fs.writeFile(FILL_DB_FILE_NAME, data);
      console.log(chalk.green(`Файл успешно создан`));
      process.exit(ExitCode.SUCCESS);
    } catch (error) {
      console.log(chalk.red(`Неудалось записать файл`));
      process.exit(ExitCode.ERROR);
    }
  },
};
