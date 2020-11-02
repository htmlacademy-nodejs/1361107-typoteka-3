"use strict";

const express = require(`express`);
const request = require(`supertest`);
const search = require(`./search`);
const DataService = require(`../data-service/search`);
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

const app = express();

app.use(express.json());
search(app, new DataService(mockData));

describe(`/search route works correct:`, () => {
  describe(`/search?query= GET request`, () => {
    let response;

    beforeAll(async () => {
      response = await request(app).get(`/search`).query({
        query: `Учим HTML и CSS`,
      });
    });

    test(`returns 200 status code`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`founds correct amount of offers`, () => {
      expect(response.body.length).toBe(1);
    });

    test(`founds offers with correct id`, () => {
      expect(response.body[0].id).toBe(`4bDd1O`);
    });
  });

  describe(`/search?query= wrong GET request`, () => {
    test(`returns code 404 if nothing was found`, async () => {
      const response = await request(app).get(`/search`).query({
        query: `Какая-то чушь`,
      });
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });

    test(`returns 400 when query string is absent`, async () => {
      const response = await request(app).get(`/search`);
      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });
  });
});
