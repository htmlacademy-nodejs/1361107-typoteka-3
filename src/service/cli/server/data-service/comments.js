"use strict";

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../../../constants`);

class CommentsService {
  findAll(article) {
    return article.comments;
  }

  delete(article, commentId) {
    const commentIndex = article.comments.findIndex((comment) => comment.id === commentId);

    if (commentIndex === -1) {
      return;
    }

    article.comments.splice(commentIndex, 1);
  }

  create(article, commentData) {
    const newComment = {id: nanoid(MAX_ID_LENGTH), ...commentData};

    article.comments.push(newComment);

    return newComment;
  }
}

module.exports = CommentsService;
