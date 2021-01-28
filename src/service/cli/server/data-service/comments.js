"use strict";
const {PAGINATION_OFFSET} = require(`../../../../constants`);
const {getSequelizeQueryOptions} = require(`../../../../utils`);

class CommentsService {
  constructor(db) {
    this._db = db;
  }

  async findByArticle(article) {
    return await article.getComments(getSequelizeQueryOptions(`Comment`, this._db));
  }

  async findAll(page) {
    return await this._db.Comment.findAndCountAll({
      ...getSequelizeQueryOptions(`Comment`, this._db),
      include: [
        {
          model: this._db.User,
          as: `user`,
          attributes: [`id`, `firstName`, `lastName`, `email`, `avatar`],
        },
        {
          model: this._db.Article,
          as: `article`,
          attributes: [`id`, `title`],
        },
      ],
      distinct: true,
      limit: PAGINATION_OFFSET,
      offset: PAGINATION_OFFSET * (page - 1),
    });
  }

  async delete(article, commentId) {
    await article.removeComment(commentId);
    await this._db.Comment.destroy({where: {id: commentId}});
  }

  async create(article, commentData) {
    const newComment = await article.createComment({articleId: article.id, ...commentData});

    return newComment;
  }
}

module.exports = CommentsService;
