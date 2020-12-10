"use strict";

const {nanoid} = require(`nanoid`);
const {
  ExitCode,
  MAX_PUBLICATION_AMOUNT,
  DEFAULT_PUBLICATION_AMOUNT,
  DataFileName,
  MAX_ID_LENGTH,
  CommentRestrict,
  ArticleRestrict,
} = require(`../../constants`);
const {
  readContent,
  shuffle,
  getRandomInt,
  getPictureFileName,
  getAvatar,
} = require(`../../utils`);
const {getLogger} = require(`../lib/logger`);
const {db, sequelize} = require(`./server/db/db`);
const logger = getLogger({name: `database`});

module.exports = {
  name: `--fill-db`,
  run: async (args) => {
    let count = Number.parseInt(args[0], 10);

    if (count > MAX_PUBLICATION_AMOUNT) {
      logger.error(`No more than 1000 ads`);
      process.exit(ExitCode.SUCCESS);
    }

    count = !count || count <= 0 ? DEFAULT_PUBLICATION_AMOUNT : count;

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

    const categoryList = categories.map((category) => {
      return {
        name: category,
      };
    });

    const userList = Array(count)
      .fill({}, 0, count)
      .map(() => {
        return {
          firstName: shuffle(firstNames)[
            getRandomInt(0, firstNames.length - 1)
          ],
          lastName: shuffle(lastNames)[getRandomInt(0, firstNames.length - 1)],
          email: `${nanoid(MAX_ID_LENGTH)}@mail.ru`,
          password: `password`,
          avatar: getAvatar(),
        };
      });

    const articleList = Array(count)
      .fill({}, 0, count)
      .map(() => {
        return {
          title: titles[getRandomInt(0, titles.length - 1)],
          picture: getPictureFileName(),
          announce: shuffle(sentences)
            .slice(0, getRandomInt(1, ArticleRestrict.MAX_ANNOUNCE_SIZE))
            .join(` `),
          fullText: shuffle(sentences)
            .slice(0, getRandomInt(1, ArticleRestrict.MAX_FULL_DESCR_SIZE))
            .join(` `),
          userId: getRandomInt(1, count),
        };
      });

    let currentArticleId = 1;
    let currentArticleCount = 0;
    const commentList = Array(count * 2)
      .fill({}, 0, count * 2)
      .map(() => {
        const userId = getRandomInt(1, count);
        if (currentArticleCount === 2) {
          currentArticleCount = 0;
          currentArticleId++;
        }
        currentArticleCount++;
        return {
          userId,
          articleId: currentArticleId,
          text: shuffle(comments)
            .slice(0, getRandomInt(1, CommentRestrict.MAX_SENTENCES_AMOUNT))
            .join(` `),
        };
      });

    try {
      await db.Category.bulkCreate(categoryList);
      await db.User.bulkCreate(userList);
      await db.Article.bulkCreate(articleList);
      await db.Comment.bulkCreate(commentList);

      const dbArticleList = await db.Article.findAll();
      await Promise.all(
          dbArticleList.map(async (article) => {
            await article.addCategories(
                shuffle([...categories])
              .slice(0, getRandomInt(1, 4))
              .map(
                  (el) => categories.findIndex((category) => category === el) + 1
              )
            );
          })
      );
      logger.info(`Database successfully filled with data.`);
      sequelize.close();
      process.exit(ExitCode.SUCCESS);
    } catch (err) {
      logger.error(`Failed to fill database: ${err.stack}`);
      sequelize.close();
      process.exit(ExitCode.ERROR);
    }
  },
};
