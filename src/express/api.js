"use strict";

const axios = require(`axios`);
const config = require(`../config`);
const {DEFAULT_API_PORT} = require(`../constants`);

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout,
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  async getArticles(page) {
    return await this._load(`/articles`, {params: {page}});
  }

  async getArticlesByCategory(page, categoryId) {
    return this._load(`/articles/category/${categoryId}`, {params: {page}});
  }

  async getArticle(id) {
    return await this._load(`/articles/${id}`);
  }

  async updateArticle(articleId, data, userEmail) {
    return this._load(`/articles/${articleId}`, {
      method: `PUT`,
      data,
      params: {
        userEmail
      }
    });
  }

  async search(search, page) {
    return this._load(`/search`, {params: {search, page}});
  }

  async getCategories() {
    return this._load(`/categories`);
  }

  async getCategory(id) {
    return this._load(`/categories/${id}`);
  }

  async createArticle(data, userEmail) {
    return this._load(`/articles`, {
      method: `POST`,
      data,
      params: {
        userEmail
      }
    });
  }

  async createComment(articleId, data, userEmail) {
    return this._load(`/articles/${articleId}/comments`, {
      method: `POST`,
      data,
      params: {
        userEmail
      }
    });
  }

  async getComments(page) {
    return this._load(`/articles/comments`, {params: {page}});
  }

  async createUser(data) {
    return await this._load(`/user/signup`, {
      method: `POST`,
      data,
    });
  }

  async loginUser(data) {
    return await this._load(`/user/login`, {
      method: `POST`,
      data,
    });
  }

  async deleteArticle(articleId, userEmail) {
    return this._load(`/articles/${articleId}`, {
      method: `DELETE`,
      params: {
        userEmail
      },
    });
  }

  async deleteComment(articleId, commentId, userEmail) {
    return this._load(`/articles/${articleId}/comments/${commentId}`, {
      method: `DELETE`,
      params: {
        userEmail
      },
    });
  }
}

const TIMEOUT = 2000;

const port = config.API_PORT || DEFAULT_API_PORT;
const defaultUrl = `http://localhost:${port}/api/`;

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI,
};
