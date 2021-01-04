/* eslint-disable max-nested-callbacks */
"use strict";

const express = require(`express`);
const request = require(`supertest`);
const articles = require(`./articles`);
const {HttpCode} = require(`../../../../constants`);
const {mockDb, sequelize, initAndFillMockDb} = require(`../db/mock-db`);
const {CategoryService, CommentsService, ArticlesService} = require(`../data-service`);

const app = express();
app.use(express.json());
articles(app, {
  articlesService: new ArticlesService(mockDb),
  commentsService: new CommentsService(mockDb),
  categoryService: new CategoryService(mockDb),
});

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
    categories: [1],
    userId: 1,
  };

  const updateArticleData = {
    title: `Какой-нибудь новый заголовок для статьи!!!`,
  };

  const mockNewComment = {
    text: `Новый комментарий, очень крутой комментарий!`,
    userId: 1,
  };

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

  describe(`/articles/:articleId wrong GET request`, () => {
    let response;

    beforeAll(async () => {
      await initAndFillMockDb();
    });

    test(`returns 400 status code if articleId is invalid`, async () => {
      response = await request(app).get(`/articles/invalid-id`);
      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

    test(`returns 404 status code if article is not exist`, async () => {
      response = await request(app).get(`/articles/999`);
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });

  describe(`/articles/category/:categoryId GET request`, () => {
    let response;

    beforeAll(async () => {
      await initAndFillMockDb();
    });

    beforeEach(async () => {
      response = await request(app).get(`/articles/category/1`);
    });

    test(`returns 200 status code`, () =>
      expect(response.statusCode).toBe(HttpCode.OK));

    test(`returns list with correct length`, () =>
      expect(response.body.articles.length).toBe(5));

    test(`returns list where each article has category with id equal 1`, () =>
      expect(
          response.body.articles.every((article) =>
            article.categories.map((category) => category.id).includes(1)
          )
      ).toBeTruthy());
  });

  describe(`/articles/category/:categoryId wrong GET request`, () => {
    let response;

    beforeAll(async () => {
      await initAndFillMockDb();
    });

    test(`returns 400 status code if categoryid is invalid`, async () => {
      response = await request(app).get(`/articles/category/invalid-id`);
      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

    test(`returns 404 status code if category is not exist`, async () => {
      response = await request(app).get(`/articles/category/999`);
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
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
  });

  describe(`/articles/:articleId PUT request`, () => {
    let response;

    beforeEach(async () => {
      await initAndFillMockDb();
      response = await request(app).put(`/articles/1`).send(updateArticleData);
    });

    test(`returns 200 status code`, () =>
      expect(response.statusCode).toBe(HttpCode.OK));

    test(`changes article in the list`, async () => {
      const responceAfterChanges = await request(app).get(`/articles/1`);
      expect(responceAfterChanges.body.title).toBe(
          `Какой-нибудь новый заголовок для статьи!!!`
      );
    });
  });

  describe(`/articles/:articleId wrong PUT request`, () => {
    let response;

    beforeAll(async () => {
      await initAndFillMockDb();
    });

    test(`returns 400 status code if articleId is invalid`, async () => {
      response = await request(app)
        .put(`/articles/invalid-id`)
        .send(updateArticleData);
      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

    test(`returns 404 status code if article was not found`, async () => {
      response = await request(app)
        .put(`/articles/999`)
        .send(updateArticleData);
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
    });

    test(`returns 204 status code anyway even when article does not exist`, async () => {
      response = await request(app).delete(`/articles/999`);
      expect(response.statusCode).toBe(HttpCode.NO_CONTENT);
    });

    test(`returns 400 status code if articleId is invalid`, async () => {
      response = await request(app).delete(`/articles/invalid-id`);
      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });
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

      expect(responseAfterCreation.body[2].text).toBe(
          `Новый комментарий, очень крутой комментарий!`
      );
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

    test(`returns 400 status code if article id is invalid`, async () => {
      response = await request(app)
        .post(`/articles/invalid-id/comments`)
        .send(mockNewComment);
      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
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
      response = await request(app).delete(`/articles/999/comments/1`);
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });

    test(`returns 400 status code if article id is invalid`, async () => {
      response = await request(app).delete(`/articles/invalid-id/comments/1`);
      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

    test(`returns 400 status code if comment id is invalid`, async () => {
      response = await request(app).delete(`/articles/1/comments/invalid-id`);
      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

    test(`returns 204 status code if a comment does not exist`, async () => {
      response = await request(app).delete(`/articles/1/comments/999`);
      expect(response.statusCode).toBe(HttpCode.NO_CONTENT);
    });
  });
});
