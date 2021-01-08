"use strict";

class UsersService {
  constructor(db) {
    this._db = db;
  }

  async create(userData) {
    return await this._db.User.create(userData);
  }
}

module.exports = UsersService;
