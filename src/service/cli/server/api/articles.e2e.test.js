"use strict";

const express = require(`express`);
const request = require(`supertest`);
const articles = require(`./articles`);
const DataService = require(`../data-service/articles`);
const CommentsService = require(`../data-service/comments`);
const {HttpCode} = require(`../../../../constants`);

const mockData = [
  {
    id: `xK-vO5`,
    announce: `Программировать не настолько сложно, как об этом говорят. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
    fullText: `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры. Как начать действовать? Для начала просто соберитесь. Из под его пера вышло 8 платиновых альбомов. Золотое сечение — соотношение двух величин, гармоническая пропорция. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Первая большая ёлка была установлена только в 1938 году. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Это один из лучших рок-музыкантов. Ёлки — это не просто красивое дерево. Это прочная древесина. Достичь успеха помогут ежедневные повторения. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Простые ежедневные упражнения помогут достичь успеха. Собрать камни бесконечности легко, если вы прирожденный герой. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Программировать не настолько сложно, как об этом говорят. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Он написал больше 30 хитов.`,
    createdDate: `2020-8-27 3:36:15`,
    сategory: [`За жизнь`],
    comments: [
      {
        id: `J6FO_e`,
        text: `Совсем немного... Согласен с автором! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`,
      },
      {id: `L0AC1b`, text: `Плюсую, но слишком много буквы!`},
      {
        id: `_oZuq_`,
        text: `Мне кажется или я уже читал это где-то? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
      },
      {id: `zGeX-k`, text: `Совсем немного... Согласен с автором!`},
    ],
  },
  {
    id: `J9QaNE`,
    announce: `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Простые ежедневные упражнения помогут достичь успеха. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Достичь успеха помогут ежедневные повторения.`,
    fullText: `Это один из лучших рок-музыкантов. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Ёлки — это не просто красивое дерево. Это прочная древесина. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры. Как начать действовать? Для начала просто соберитесь. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Достичь успеха помогут ежедневные повторения. Простые ежедневные упражнения помогут достичь успеха. Золотое сечение — соотношение двух величин, гармоническая пропорция. Первая большая ёлка была установлена только в 1938 году. Собрать камни бесконечности легко, если вы прирожденный герой. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    createdDate: `2020-8-30 14:53:33`,
    сategory: [`Деревья`, `Музыка`, `Программирование`, `IT`],
    comments: [
      {
        id: `MTH7WG`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Хочу такую же футболку :-) Плюсую, но слишком много буквы!`,
      },
    ],
  },
  {
    id: `PIJ0WU`,
    announce: `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Из под его пера вышло 8 платиновых альбомов. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    fullText: `Первая большая ёлка была установлена только в 1938 году. Простые ежедневные упражнения помогут достичь успеха. Золотое сечение — соотношение двух величин, гармоническая пропорция. Как начать действовать? Для начала просто соберитесь. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Программировать не настолько сложно, как об этом говорят. Собрать камни бесконечности легко, если вы прирожденный герой. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Он написал больше 30 хитов. Из под его пера вышло 8 платиновых альбомов. Достичь успеха помогут ежедневные повторения.`,
    createdDate: `2020-8-2 22:30:32`,
    сategory: [`Разное`, `IT`],
    comments: [
      {id: `sjCNtD`, text: `Мне кажется или я уже читал это где-то?`},
      {
        id: `O2OW8U`,
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Мне кажется или я уже читал это где-то?`,
      },
    ],
  },
  {
    id: `qTfv3W`,
    announce: `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Золотое сечение — соотношение двух величин, гармоническая пропорция. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Он написал больше 30 хитов. Достичь успеха помогут ежедневные повторения.`,
    fullText: `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Достичь успеха помогут ежедневные повторения. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Из под его пера вышло 8 платиновых альбомов. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
    createdDate: `2020-8-26 18:16:28`,
    сategory: [`Программирование`, `Разное`, `Деревья`, `Железо`, `Без рамки`],
    comments: [
      {
        id: `0reRtp`,
        text: `Совсем немного... Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Это где ж такие красоты?`,
      },
      {
        id: `U6CxNb`,
        text: `Плюсую, но слишком много буквы! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Планируете записать видосик на эту тему`,
      },
      {
        id: `KD6AMi`,
        text: `Это где ж такие красоты? Мне кажется или я уже читал это где-то? Согласен с автором!`,
      },
      {id: `wVkrh-`, text: `Хочу такую же футболку :-)`},
      {id: `CEzdG5`, text: `Плюсую, но слишком много буквы!`},
    ],
  },
  {
    id: `AanGDH`,
    announce: `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Это один из лучших рок-музыкантов. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Простые ежедневные упражнения помогут достичь успеха.`,
    fullText: `Он написал больше 30 хитов. Как начать действовать? Для начала просто соберитесь. Из под его пера вышло 8 платиновых альбомов. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Программировать не настолько сложно, как об этом говорят. Достичь успеха помогут ежедневные повторения. Простые ежедневные упражнения помогут достичь успеха.`,
    createdDate: `2020-10-8 23:38:06`,
    сategory: [`Кино`, `Железо`],
    comments: [
      {id: `Ov2OV6`, text: `Хочу такую же футболку :-)`},
      {
        id: `D3Q357`,
        text: `Планируете записать видосик на эту тему Это где ж такие красоты? Плюсую, но слишком много буквы!`,
      },
      {
        id: `mr3XIA`,
        text: `Это где ж такие красоты? Хочу такую же футболку :-) Мне кажется или я уже читал это где-то?`,
      },
      {
        id: `rHqTLj`,
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Плюсую, но слишком много буквы! Планируете записать видосик на эту тему`,
      },
    ],
  },
];

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  articles(app, new DataService(cloneData), new CommentsService());
  return app;
};

describe(`/articles route works correctly:`, () => {
  const mockNewArticle = {
    announce: `Программировать не настолько сложно, как об этом говорят. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
    fullText: `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры.`,
    createdDate: `2020-8-27 3:36:15`,
    сategory: [`За жизнь`],
  };

  const mockNewComment = {text: `Новый комментарий!`};

  let app;

  describe(`/articles GET request`, () => {
    let response;

    beforeAll(() => {
      app = createAPI();
    });

    beforeEach(async () => {
      response = await request(app).get(`/articles`);
    });

    test(`returns 200 status code`, () =>
      expect(response.statusCode).toBe(HttpCode.OK));

    test(`returns list with correct length`, () =>
      expect(response.body.length).toBe(5));

    test(`returns list where second article's id is correct`, () =>
      expect(response.body[1].id).toBe(`J9QaNE`));
  });

  describe(`/articles/:articleId GET request`, () => {
    let response;

    beforeAll(() => {
      app = createAPI();
    });

    beforeEach(async () => {
      response = await request(app).get(`/articles/xK-vO5`);
    });

    test(`returns 200 status code`, () =>
      expect(response.statusCode).toBe(HttpCode.OK));

    test(`returns correct article`, () => {
      expect(response.body.announce).toBe(
          `Программировать не настолько сложно, как об этом говорят. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`
      );
      expect(response.body.fullText).toBe(
          `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры. Как начать действовать? Для начала просто соберитесь. Из под его пера вышло 8 платиновых альбомов. Золотое сечение — соотношение двух величин, гармоническая пропорция. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Первая большая ёлка была установлена только в 1938 году. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Это один из лучших рок-музыкантов. Ёлки — это не просто красивое дерево. Это прочная древесина. Достичь успеха помогут ежедневные повторения. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Простые ежедневные упражнения помогут достичь успеха. Собрать камни бесконечности легко, если вы прирожденный герой. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Программировать не настолько сложно, как об этом говорят. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Он написал больше 30 хитов.`
      );
    });
  });

  describe(`/articles POST request`, () => {
    let response;

    beforeEach(async () => {
      app = createAPI();
      response = await request(app).post(`/articles`).send(mockNewArticle);
    });

    test(`returns 201 status code`, () =>
      expect(response.statusCode).toBe(HttpCode.CREATED));

    test(`creates new article`, async () => {
      const responseAfterIncrease = await request(app).get(`/articles`);
      expect(responseAfterIncrease.body.length).toBe(6);
    });
  });

  describe(`/articles wrong POST request`, () => {
    beforeEach(async () => {
      app = createAPI();
    });

    test(`returns 400 status code if data is not correct`, async () => {
      for (const key of Object.keys(mockNewArticle)) {
        const badarticle = {...mockNewArticle};
        delete badarticle[key];
        const badResponse = await request(app)
          .post(`/articles`)
          .send(badarticle);
        expect(badResponse.statusCode).toBe(HttpCode.BAD_REQUEST);
      }
    });
  });

  describe(`/articles/:articleId PUT request`, () => {
    let response;

    beforeEach(async () => {
      app = createAPI();
      response = await request(app)
        .put(`/articles/xK-vO5`)
        .send(mockNewArticle);
    });

    test(`returns 200 status code`, () =>
      expect(response.statusCode).toBe(HttpCode.OK));

    test(`returns changed article`, () =>
      expect(response.body).toEqual(expect.objectContaining(mockNewArticle)));

    test(`changes article in the list`, async () => {
      const responceAfterChanges = await request(app).get(`/articles/xK-vO5`);
      expect(responceAfterChanges.body.announce).toBe(
          `Программировать не настолько сложно, как об этом говорят. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`
      );
    });
  });

  describe(`/articles/:articleId wrong PUT request`, () => {
    let response;

    beforeEach(async () => {
      app = createAPI();
    });

    test(`returns 404 status code if article id was not found`, async () => {
      response = await request(app)
        .put(`/articles/non-existent-id`)
        .send(mockNewArticle);
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });

    test(`returns 400 status code if data is invalid`, async () => {
      for (const key of Object.keys(mockNewArticle)) {
        const badarticle = {...mockNewArticle};
        delete badarticle[key];
        const badResponse = await request(app)
          .put(`/articles/xK-vO5`)
          .send(badarticle);
        expect(badResponse.statusCode).toBe(HttpCode.BAD_REQUEST);
      }
    });
  });

  describe(`/articles/:articleId DELETE request`, () => {
    let response;

    beforeEach(async () => {
      app = createAPI();
      response = await request(app).delete(`/articles/xK-vO5`);
    });

    test(`returns 204 status code`, () =>
      expect(response.statusCode).toBe(HttpCode.NO_CONTENT));

    test(`deletes an article`, async () => {
      const responceAfterChanges = await request(app).get(`/articles/xK-vO5`);
      expect(responceAfterChanges.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });

  describe(`/articles/:articleId wrong DELETE request`, () => {
    let response;

    beforeEach(async () => {
      app = createAPI();
      response = await request(app).delete(`/articles/non-existent-id`);
    });

    test(`returns 204 status code anyway`, () =>
      expect(response.statusCode).toBe(HttpCode.NO_CONTENT));
  });

  describe(`/articles/:articleId/comments GET request`, () => {
    let response;

    beforeAll(async () => {
      app = createAPI();
      response = await request(app).get(`/articles/xK-vO5/comments`);
    });

    test(`returns 200 status code`, async () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`returns comments list`, () => expect(response.body.length).toBe(4));
  });

  describe(`/articles/:articleId/comments POST request`, () => {
    let response;

    beforeAll(async () => {
      app = createAPI();
      response = await request(app)
        .post(`/articles/xK-vO5/comments`)
        .send(mockNewComment);
    });

    test(`returns 200 status code`, async () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`creates a comment`, async () => {
      const responseAfterCreation = await request(app).get(
          `/articles/xK-vO5/comments`
      );

      expect(responseAfterCreation.body[4].text).toBe(`Новый комментарий!`);
    });
  });

  describe(`/articles/:articleId/comments wrong POST request`, () => {
    let response;

    beforeAll(async () => {
      app = createAPI();
    });

    test(`returns 404 status code if an article does not exist`, async () => {
      response = await request(app)
        .post(`/articles/non-existent-id/comments`)
        .send(mockNewComment);
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });

    test(`returns 400 status code if data is invalid`, async () => {
      response = await request(app).post(`/articles/xK-vO5/comments`).send({
        message: `Новый комментарий!`,
      });
      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });
  });

  describe(`/articles/:articleId/comments/:commentId DELETE request`, () => {
    let response;

    beforeEach(async () => {
      app = createAPI();
      response = await request(app).delete(`/articles/xK-vO5/comments/HHVKWb`);
    });

    test(`returns 204 status code`, () =>
      expect(response.statusCode).toBe(HttpCode.NO_CONTENT));

    test(`deletes a comment`, async () => {
      const responseAfterDeleting = await request(app).get(
          `/articles/xK-vO5/comments`
      );
      expect(responseAfterDeleting.body.length).toBe(4);
    });
  });

  describe(`/articles/:articleId/comments/:commentId wrong DELETE request`, () => {
    let response;

    beforeAll(async () => {
      app = createAPI();
    });

    test(`returns 404 status code if an article does not exist`, async () => {
      response = await request(app).delete(
          `/articles/non-existent-id/comments/HHVKWb`
      );
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });

    test(`returns 204 status code if a comment does not exist`, async () => {
      response = await request(app).delete(
          `/articles/xK-vO5/comments/non-existent-id`
      );
      expect(response.statusCode).toBe(HttpCode.NO_CONTENT);
    });
  });
});
