"use strict";

const Sequelize = require(`sequelize`);
const config = require(`../../../../config`);

const sequelize = new Sequelize(
    config.DB_NAME_TEST,
    config.DB_USER,
    config.DB_PASSWORD,
    {
      host: config.DB_HOST,
      dialect: `postgres`,
      logging: false,
    }
);

const Category = require(`./models/category`)(sequelize);
const Comment = require(`./models/comment`)(sequelize);
const Article = require(`./models/article`)(sequelize);
const User = require(`./models/user`)(sequelize);
const ArticleCategories = require(`./models/article-categories`)(sequelize);

User.hasMany(Comment, {
  foreignKey: `userId`,
  as: `comments`,
});
Comment.belongsTo(User, {
  foreignKey: `userId`,
  as: `user`,
});

Article.hasMany(Comment, {
  foreignKey: `articleId`,
  as: `comments`,
});
Comment.belongsTo(Article, {
  foreignKey: `articleId`,
  as: `article`,
});

Category.belongsToMany(Article, {
  through: `Article_Categories`,
  as: `articles`,
  timestamps: false,
  foreignKey: `categoryId`,
  otherKey: `articleId`,
});
Article.belongsToMany(Category, {
  through: `Article_Categories`,
  as: `categories`,
  timestamps: false,
  foreignKey: `articleId`,
  otherKey: `categoryId`,
});
Category.hasMany(ArticleCategories, {
  foreignKey: `categoryId`
});
ArticleCategories.belongsTo(Category, {
  foreignKey: `categoryId`,
  as: `category`
});
Article.hasMany(ArticleCategories, {
  foreignKey: `articleId`
});
ArticleCategories.belongsTo(Article, {
  foreignKey: `articleId`,
  as: `article`
});

const initAndFillMockDb = async () => {
  await sequelize.sync({force: true});

  const mockDBData = {
    categoryList: [{name: `Деревья`}, {name: `За жизнь`}],
    userList: [
      {
        firstName: `Николай`,
        lastName: `Курицын`,
        email: `VZlBsS@mail.ru`,
        password: `password`,
        avatar: `avatar-3.png`,
      },
      {
        firstName: `Евгений`,
        lastName: `Щеглов`,
        email: `uwCTNY@mail.ru`,
        password: `password`,
        avatar: `avatar-1.png`,
      },
      {
        firstName: `Игорь`,
        lastName: `Курицын`,
        email: `WGhDqf@mail.ru`,
        password: `password`,
        avatar: `avatar-1.png`,
      },
      {
        firstName: `Евгений`,
        lastName: `Максимов`,
        email: `wVU4ha@mail.ru`,
        password: `password`,
        avatar: `avatar-5.png`,
      },
      {
        firstName: `Максим`,
        lastName: `Максимов`,
        email: `uuqM1U@mail.ru`,
        password: `password`,
        avatar: `avatar-2.png`,
      },
    ],
    articleList: [
      {
        title: `Ёлки. История деревьев`,
        picture: `sea@1x.jpg`,
        announce: `Как начать действовать? Для начала просто соберитесь. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
        fullText: `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Из под его пера вышло 8 платиновых альбомов. Ёлки — это не просто красивое дерево. Это прочная древесина. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Золотое сечение — соотношение двух величин, гармоническая пропорция. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
        userId: 1,
      },
      {
        title: `Как перестать беспокоиться и начать жить`,
        picture: `sea-fullsize@1x.jpg`,
        announce: `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
        fullText: `Ёлки — это не просто красивое дерево. Это прочная древесина. Он написал больше 30 хитов. Это один из лучших рок-музыкантов. Первая большая ёлка была установлена только в 1938 году.`,
        userId: 3,
      },
      {
        title: `Обзор новейшего смартфона`,
        picture: `forest@1x.jpg`,
        announce: `Программировать не настолько сложно, как об этом говорят. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
        fullText: `Из под его пера вышло 8 платиновых альбомов. Достичь успеха помогут ежедневные повторения. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Это один из лучших рок-музыкантов. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
        userId: 1,
      },
      {
        title: `Самый лучший музыкальный альбом этого года`,
        picture: `forest@1x.jpg`,
        announce: `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
        fullText: `Как начать действовать? Для начала просто соберитесь.`,
        userId: 3,
      },
      {
        title: `Как собрать камни бесконечности`,
        picture: `sea@1x.jpg`,
        announce: `Это один из лучших рок-музыкантов.`,
        fullText: `Простые ежедневные упражнения помогут достичь успеха.`,
        userId: 1,
      },
    ],
    commentList: [
      {
        userId: 3,
        articleId: 1,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`,
      },
      {
        userId: 5,
        articleId: 1,
        text: `Хочу такую же футболку :-) Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
      },
      {userId: 5, articleId: 2, text: `Согласен с автором!`},
      {
        userId: 2,
        articleId: 2,
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Совсем немного... Мне кажется или я уже читал это где-то?`,
      },
      {userId: 1, articleId: 3, text: `Совсем немного...`},
      {
        userId: 4,
        articleId: 3,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
      },
      {
        userId: 2,
        articleId: 4,
        text: `Хочу такую же футболку :-) Совсем немного...`,
      },
      {userId: 2, articleId: 4, text: `Плюсую, но слишком много буквы!`},
      {
        userId: 3,
        articleId: 5,
        text: `Мне кажется или я уже читал это где-то? Совсем немного... Плюсую, но слишком много буквы!`,
      },
      {
        userId: 4,
        articleId: 5,
        text: `Согласен с автором! Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
      },
    ],
  };

  await Category.bulkCreate(mockDBData.categoryList);
  await User.bulkCreate(mockDBData.userList);
  await Article.bulkCreate(mockDBData.articleList);
  await Comment.bulkCreate(mockDBData.commentList);

  const dbArticleList = await Article.findAll();
  await Promise.all(
      dbArticleList.map(async (article) => {
        await article.addCategories([1, 2]);
      })
  );
};

module.exports = {
  mockDb: {
    Category,
    User,
    Comment,
    Article,
    ArticleCategories
  },
  sequelize,
  initAndFillMockDb,
};
