"use strict";
const {getSequelizeQueryOptions} = require(`../../../../utils`);

class CommentsService {
  constructor(db) {
    this._db = db;
  }

  async findAll(article) {
    return await article.getComments(getSequelizeQueryOptions(`Comment`, this._db));
  }

  async delete(article, commentId) {
    await article.removeComment(commentId);
  }

  async create(article, commentData) {
    const newComment = await article.createComment({articleId: article.id, ...commentData});

    return newComment;
  }
}

module.exports = CommentsService;
