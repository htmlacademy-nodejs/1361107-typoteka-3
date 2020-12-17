"use strict";

const express = require(`express`);
const request = require(`supertest`);
const articles = require(`./articles`);
const DataService = require(`../data-service/articles`);
const CommentsService = require(`../data-service/comments`);
const {HttpCode} = require(`../../../../constants`);
const {mockDb, sequelize, initAndFillMockDb} = require(`../db/mock-db`);

const app = express();
app.use(express.json());
articles(app, new DataService(mockDb), new CommentsService(mockDb));

describe(`/articles route works correctly:`, () => {
  beforeAll(async () => {
    await initAndFillMockDb();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  const mockNewArticle = {
    title: `Как собрать камни бесконечности`,
    announce: `Программировать не настолько сложно, как об этом говорят. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
    fullText: `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры.`,
    category: [1],
    userId: 1,
  };

  const mockNewComment = {text: `Новый комментарий!`, userId: 1};

  describe(`/articles GET request`, () => {
    let response;

    beforeAll(async () => {
      await initAndFillMockDb();
    });

    beforeEach(async () => {
      response = await request(app).get(`/articles`);
    });

    test(`returns 200 status code`, () =>
      expect(response.statusCode).toBe(HttpCode.OK));

    test(`returns list with correct length`, () =>
      expect(response.body.rows.length).toBe(5));

    test(`returns list where second article's id is correct`, () =>
      expect(response.body.rows[1].id).toBe(2));
  });

  describe(`/articles/:articleId GET request`, () => {
    let response;

    beforeAll(async () => {
      await initAndFillMockDb();
    });

    beforeEach(async () => {
      response = await request(app).get(`/articles/1`);
    });

    test(`returns 200 status code`, () =>
      expect(response.statusCode).toBe(HttpCode.OK));

    test(`returns correct article`, () => {
      expect(response.body.announce).toBe(
          `Как начать действовать? Для начала просто соберитесь. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`
      );
      expect(response.body.title).toBe(`Ёлки. История деревьев`);
    });
  });

  describe(`/articles POST request`, () => {
    let response;

    beforeEach(async () => {
      await initAndFillMockDb();
      response = await request(app).post(`/articles`).send(mockNewArticle);
    });

    test(`returns 201 status code`, () =>
      expect(response.statusCode).toBe(HttpCode.CREATED));

    test(`creates new article`, async () => {
      const responseAfterIncrease = await request(app).get(`/articles`);
      expect(responseAfterIncrease.body.rows.length).toBe(6);
    });
  });

  describe(`/articles wrong POST request`, () => {
    beforeEach(async () => {
      await initAndFillMockDb();
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
      await initAndFillMockDb();
      response = await request(app)
        .put(`/articles/1`)
        .send(mockNewArticle);
    });

    test(`returns 200 status code`, () =>
      expect(response.statusCode).toBe(HttpCode.OK));

    test(`changes article in the list`, async () => {
      const responceAfterChanges = await request(app).get(`/articles/1`);
      expect(responceAfterChanges.body.announce).toBe(
          `Программировать не настолько сложно, как об этом говорят. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`
      );
    });
  });

  describe(`/articles/:articleId wrong PUT request`, () => {
    let response;

    beforeAll(async () => {
      await initAndFillMockDb();
    });

    test(`returns 404 status code if article id was not found`, async () => {
      response = await request(app)
        .put(`/articles/999`)
        .send(mockNewArticle);
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });

  describe(`/articles/:articleId DELETE request`, () => {
    let response;

    beforeEach(async () => {
      await initAndFillMockDb();
      response = await request(app).delete(`/articles/1`);
    });

    test(`returns 204 status code`, () =>
      expect(response.statusCode).toBe(HttpCode.NO_CONTENT));

    test(`deletes an article`, async () => {
      const responceAfterChanges = await request(app).get(`/articles/1`);
      expect(responceAfterChanges.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });

  describe(`/articles/:articleId wrong DELETE request`, () => {
    let response;

    beforeEach(async () => {
      await initAndFillMockDb();
      response = await request(app).delete(`/articles/999`);
    });

    test(`returns 204 status code anyway`, () =>
      expect(response.statusCode).toBe(HttpCode.NO_CONTENT));
  });

  describe(`/articles/:articleId/comments GET request`, () => {
    let response;

    beforeAll(async () => {
      await initAndFillMockDb();
      response = await request(app).get(`/articles/1/comments`);
    });

    test(`returns 200 status code`, async () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`returns comments list`, () => expect(response.body.length).toBe(2));
  });

  describe(`/articles/:articleId/comments POST request`, () => {
    let response;

    beforeAll(async () => {
      await initAndFillMockDb();
      response = await request(app)
        .post(`/articles/1/comments`)
        .send(mockNewComment);
    });

    test(`returns 200 status code`, async () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`creates a comment`, async () => {
      const responseAfterCreation = await request(app).get(
          `/articles/1/comments`
      );

      expect(responseAfterCreation.body[2].text).toBe(`Новый комментарий!`);
    });
  });

  describe(`/articles/:articleId/comments wrong POST request`, () => {
    let response;

    beforeAll(async () => {
      await initAndFillMockDb();
    });

    test(`returns 404 status code if an article does not exist`, async () => {
      response = await request(app)
        .post(`/articles/999/comments`)
        .send(mockNewComment);
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });

    test(`returns 400 status code if data is invalid`, async () => {
      response = await request(app).post(`/articles/1/comments`).send({
        message: `Новый комментарий!`,
      });
      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });
  });

  describe(`/articles/:articleId/comments/:commentId DELETE request`, () => {
    let response;

    beforeEach(async () => {
      await initAndFillMockDb();
      response = await request(app).delete(`/articles/1/comments/1`);
    });

    test(`returns 204 status code`, () =>
      expect(response.statusCode).toBe(HttpCode.NO_CONTENT));

    test(`deletes a comment`, async () => {
      const responseAfterDeleting = await request(app).get(
          `/articles/1/comments`
      );
      expect(responseAfterDeleting.body.length).toBe(1);
    });
  });

  describe(`/articles/:articleId/comments/:commentId wrong DELETE request`, () => {
    let response;

    beforeAll(async () => {
      await initAndFillMockDb();
    });

    test(`returns 404 status code if an article does not exist`, async () => {
      response = await request(app).delete(
          `/articles/999/comments/1`
      );
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });

    test(`returns 204 status code if a comment does not exist`, async () => {
      response = await request(app).delete(
          `/articles/1/comments/999`
      );
      expect(response.statusCode).toBe(HttpCode.NO_CONTENT);
    });
  });
});
