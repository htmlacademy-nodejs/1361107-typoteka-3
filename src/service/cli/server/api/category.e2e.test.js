"use strict";

const express = require(`express`);
const request = require(`supertest`);
const category = require(`./category`);
const DataService = require(`../data-service/category`);
const {HttpCode} = require(`../../../../constants`);
const {mockDb, sequelize, initAndFillMockDb} = require(`../db/mock-db`);

const app = express();

app.use(express.json());
category(app, new DataService(mockDb));

describe(`/categories route works correctly:`, () => {
  beforeAll(async () => {
    await initAndFillMockDb();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe(`/categories GET request`, () => {
    let response;

    beforeAll(async () => {
      await initAndFillMockDb();
      response = await request(app).get(`/categories`);
    });

    test(`returns 200 status code`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`returns list with correct length`, () => {
      expect(response.body.length).toBe(2);
    });

    test(`returns correct list of categories`, () => {
      expect(response.body).toEqual(
          expect.arrayContaining([
            {articleCount: `5`, id: 1, name: `Деревья`},
            {articleCount: `5`, id: 2, name: `За жизнь`},
          ])
      );
    });
  });

  describe(`/categories/:categoryId GET request`, () => {
    let response;

    beforeAll(async () => {
      await initAndFillMockDb();
      response = await request(app).get(`/categories/1`);
    });

    test(`returns 200 status code`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`returns correct category`, () => {
      expect(response.body.id).toBe(1);
    });
  });

  describe(`/categories/:categoryId wrong GET request`, () => {
    let response;

    beforeAll(async () => {
      await initAndFillMockDb();
    });

    test(`returns 400 status code if categoryid is invalid`, async () => {
      response = await request(app).get(`/categories/invalid-id`);
      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

    test(`returns 404 status code if category is not exist`, async () => {
      response = await request(app).get(`/categories/999`);
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });
});
