"use strict";

const axios = require(`axios`);
const config = require(`../config`);
const {DEFAULT_API_PORT} = require(`../constants`);

class API {

  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  async getArticles(page) {
    return await this._load(`/articles`, {params: {page}});
  }

  async getArticle(id) {
    return await this._load(`/articles/${id}`);
  }

  async search(search, page) {
    return this._load(`/search`, {params: {search, page}});
  }

  async getCategories() {
    return this._load(`/categories`);
  }

  async createArticle(data) {
    return this._load(`/articles`, {
      method: `POST`,
      data
    });
  }

  async createComment(articleId, data) {
    return this._load(`/articles/${articleId}/comments`, {
      method: `POST`,
      data
    });
  }
}

const TIMEOUT = 2000;

const port = config.API_PORT || DEFAULT_API_PORT;
const defaultUrl = `http://localhost:${port}/api/`;

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
