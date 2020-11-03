"use strict";

const express = require(`express`);
const request = require(`supertest`);
const articles = require(`./articles`);
const DataService = require(`../data-service/articles`);
const CommentsService = require(`../data-service/comments`);
const {HttpCode} = require(`../../../../constants`);

const mockData = [
  {
    id: `L25T2N`,
    title: `Как собрать камни бесконечности`,
    announce: `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
    fullText: `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Простые ежедневные упражнения помогут достичь успеха. Как начать действовать? Для начала просто соберитесь. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Программировать не настолько сложно, как об этом говорят. Собрать камни бесконечности легко, если вы прирожденный герой. Из под его пера вышло 8 платиновых альбомов. Достичь успеха помогут ежедневные повторения. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Он написал больше 30 хитов. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Ёлки — это не просто красивое дерево. Это прочная древесина. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Первая большая ёлка была установлена только в 1938 году. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Золотое сечение — соотношение двух величин, гармоническая пропорция. Это один из лучших рок-музыкантов.`,
    createdDate: `18.09.2020, 06:39`,
    сategory: [`За жизнь`, `Разное`],
    picture: `skyscraper@1x.jpg`,
    comments: [
      {
        id: `zCV3Q6`,
        text: `Хочу такую же футболку :-) Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`,
      },
      {
        id: `QdBhYW`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
      },
      {
        id: `cb2A2X`,
        text: `Хочу такую же футболку :-) Согласен с автором! Это где ж такие красоты?`,
      },
    ],
  },
  {
    id: `yC9xQT`,
    title: `Ёлки. История деревьев`,
    announce: `Первая большая ёлка была установлена только в 1938 году. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Простые ежедневные упражнения помогут достичь успеха. Как начать действовать? Для начала просто соберитесь. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
    fullText: `Он написал больше 30 хитов. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры. Из под его пера вышло 8 платиновых альбомов. Как начать действовать? Для начала просто соберитесь. Золотое сечение — соотношение двух величин, гармоническая пропорция. Первая большая ёлка была установлена только в 1938 году. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Достичь успеха помогут ежедневные повторения. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Простые ежедневные упражнения помогут достичь успеха.`,
    createdDate: `02.09.2020, 05:11`,
    сategory: [`IT`, `Музыка`],
    comments: [
      {id: `LFWIH-`, text: `Это где ж такие красоты?`},
      {id: `w4-vxK`, text: `Хочу такую же футболку :-)`},
      {id: `qE-B1R`, text: `Совсем немного...`},
      {id: `Vl9U8U`, text: `Согласен с автором! Совсем немного...`},
    ],
  },
  {
    id: `4bDd1O`,
    title: `Учим HTML и CSS`,
    announce: `Золотое сечение — соотношение двух величин, гармоническая пропорция. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Собрать камни бесконечности легко, если вы прирожденный герой.`,
    fullText: `Первая большая ёлка была установлена только в 1938 году. Как начать действовать? Для начала просто соберитесь. Из под его пера вышло 8 платиновых альбомов. Программировать не настолько сложно, как об этом говорят. Это один из лучших рок-музыкантов. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Он написал больше 30 хитов. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Простые ежедневные упражнения помогут достичь успеха. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Золотое сечение — соотношение двух величин, гармоническая пропорция. Достичь успеха помогут ежедневные повторения. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры. Ёлки — это не просто красивое дерево. Это прочная древесина. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Собрать камни бесконечности легко, если вы прирожденный герой.`,
    createdDate: `04.07.2020, 13:21`,
    сategory: [`Программирование`, `Деревья`, `Музыка`, `За жизнь`, `IT`],
    comments: [
      {id: `lXNMGl`, text: `Мне кажется или я уже читал это где-то?`},
      {
        id: `pPVn6_`,
        text: `Планируете записать видосик на эту тему Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
      },
      {
        id: `eoaNgo`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Плюсую, но слишком много буквы!`,
      },
      {
        id: `jPHnbM`,
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Хочу такую же футболку :-)`,
      },
    ],
  },
  {
    id: `A_2i4X`,
    title: `Как собрать камни бесконечности`,
    announce: `Золотое сечение — соотношение двух величин, гармоническая пропорция. Первая большая ёлка была установлена только в 1938 году.`,
    fullText: `Первая большая ёлка была установлена только в 1938 году. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Собрать камни бесконечности легко, если вы прирожденный герой. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Золотое сечение — соотношение двух величин, гармоническая пропорция. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Как начать действовать? Для начала просто соберитесь. Из под его пера вышло 8 платиновых альбомов. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Это один из лучших рок-музыкантов. Программировать не настолько сложно, как об этом говорят. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Простые ежедневные упражнения помогут достичь успеха. Он написал больше 30 хитов. Ёлки — это не просто красивое дерево. Это прочная древесина. Достичь успеха помогут ежедневные повторения. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры. Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
    createdDate: `14.09.2020, 13:26`,
    сategory: [`Музыка`, `За жизнь`],
    comments: [
      {id: `tmzaxs`, text: `Хочу такую же футболку :-)`},
      {
        id: `o1CdrX`,
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Согласен с автором! Совсем немного...`,
      },
      {
        id: `TFZz-R`,
        text: `Плюсую, но слишком много буквы! Планируете записать видосик на эту тему`,
      },
      {
        id: `4rI5es`,
        text: `Это где ж такие красоты? Хочу такую же футболку :-)`,
      },
    ],
  },
  {
    id: `Yi308u`,
    title: `Ёлки. История деревьев`,
    announce: `Программировать не настолько сложно, как об этом говорят.`,
    fullText: `Как начать действовать? Для начала просто соберитесь. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры. Ёлки — это не просто красивое дерево. Это прочная древесина. Простые ежедневные упражнения помогут достичь успеха. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Программировать не настолько сложно, как об этом говорят. Золотое сечение — соотношение двух величин, гармоническая пропорция. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Из под его пера вышло 8 платиновых альбомов. Он написал больше 30 хитов. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Это один из лучших рок-музыкантов. Достичь успеха помогут ежедневные повторения. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Первая большая ёлка была установлена только в 1938 году. Собрать камни бесконечности легко, если вы прирожденный герой.`,
    createdDate: `15.08.2020, 23:08`,
    сategory: [`За жизнь`],
    comments: [
      {
        id: `2Z4CIB`,
        text: `Планируете записать видосик на эту тему Совсем немного... Согласен с автором!`,
      },
      {
        id: `tjeWT3`,
        text: `Плюсую, но слишком много буквы! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Планируете записать видосик на эту тему`,
      },
      {
        id: `rv1wD1`,
        text: `Хочу такую же футболку :-) Плюсую, но слишком много буквы! Совсем немного...`,
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
    title: `Как собрать камни бесконечности`,
    announce: `Программировать не настолько сложно, как об этом говорят. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
    fullText: `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры.`,
    createdDate: `2020-8-27 3:36:15`,
    category: [`За жизнь`],
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
      expect(response.body[1].id).toBe(`yC9xQT`));
  });

  describe(`/articles/:articleId GET request`, () => {
    let response;

    beforeAll(() => {
      app = createAPI();
    });

    beforeEach(async () => {
      response = await request(app).get(`/articles/L25T2N`);
    });

    test(`returns 200 status code`, () =>
      expect(response.statusCode).toBe(HttpCode.OK));

    test(`returns correct article`, () => {
      expect(response.body.announce).toBe(
          `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`
      );
      expect(response.body.fullText).toBe(
          `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Простые ежедневные упражнения помогут достичь успеха. Как начать действовать? Для начала просто соберитесь. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Программировать не настолько сложно, как об этом говорят. Собрать камни бесконечности легко, если вы прирожденный герой. Из под его пера вышло 8 платиновых альбомов. Достичь успеха помогут ежедневные повторения. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Он написал больше 30 хитов. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Ёлки — это не просто красивое дерево. Это прочная древесина. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Первая большая ёлка была установлена только в 1938 году. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Золотое сечение — соотношение двух величин, гармоническая пропорция. Это один из лучших рок-музыкантов.`
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
        .put(`/articles/L25T2N`)
        .send(mockNewArticle);
    });

    test(`returns 200 status code`, () =>
      expect(response.statusCode).toBe(HttpCode.OK));

    test(`returns changed article`, () =>
      expect(response.body).toEqual(expect.objectContaining(mockNewArticle)));

    test(`changes article in the list`, async () => {
      const responceAfterChanges = await request(app).get(`/articles/L25T2N`);
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
          .put(`/articles/L25T2N`)
          .send(badarticle);
        expect(badResponse.statusCode).toBe(HttpCode.BAD_REQUEST);
      }
    });
  });

  describe(`/articles/:articleId DELETE request`, () => {
    let response;

    beforeEach(async () => {
      app = createAPI();
      response = await request(app).delete(`/articles/L25T2N`);
    });

    test(`returns 204 status code`, () =>
      expect(response.statusCode).toBe(HttpCode.NO_CONTENT));

    test(`deletes an article`, async () => {
      const responceAfterChanges = await request(app).get(`/articles/L25T2N`);
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
      response = await request(app).get(`/articles/L25T2N/comments`);
    });

    test(`returns 200 status code`, async () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`returns comments list`, () => expect(response.body.length).toBe(3));
  });

  describe(`/articles/:articleId/comments POST request`, () => {
    let response;

    beforeAll(async () => {
      app = createAPI();
      response = await request(app)
        .post(`/articles/L25T2N/comments`)
        .send(mockNewComment);
    });

    test(`returns 200 status code`, async () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`creates a comment`, async () => {
      const responseAfterCreation = await request(app).get(
          `/articles/L25T2N/comments`
      );

      expect(responseAfterCreation.body[3].text).toBe(`Новый комментарий!`);
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
      response = await request(app).post(`/articles/L25T2N/comments`).send({
        message: `Новый комментарий!`,
      });
      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });
  });

  describe(`/articles/:articleId/comments/:commentId DELETE request`, () => {
    let response;

    beforeEach(async () => {
      app = createAPI();
      response = await request(app).delete(`/articles/L25T2N/comments/zCV3Q6`);
    });

    test(`returns 204 status code`, () =>
      expect(response.statusCode).toBe(HttpCode.NO_CONTENT));

    test(`deletes a comment`, async () => {
      const responseAfterDeleting = await request(app).get(
          `/articles/L25T2N/comments`
      );
      expect(responseAfterDeleting.body.length).toBe(2);
    });
  });

  describe(`/articles/:articleId/comments/:commentId wrong DELETE request`, () => {
    let response;

    beforeAll(async () => {
      app = createAPI();
    });

    test(`returns 404 status code if an article does not exist`, async () => {
      response = await request(app).delete(
          `/articles/non-existent-id/comments/zCV3Q6`
      );
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });

    test(`returns 204 status code if a comment does not exist`, async () => {
      response = await request(app).delete(
          `/articles/L25T2N/comments/non-existent-id`
      );
      expect(response.statusCode).toBe(HttpCode.NO_CONTENT);
    });
  });
});
