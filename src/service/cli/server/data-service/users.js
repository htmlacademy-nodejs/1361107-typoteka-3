"use strict";

const bcrypt = require(`bcrypt`);
const {SALT_ROUNDS} = require(`../../../../constants`);
const {getSequelizeQueryOptions} = require(`../../../../utils`);

class UsersService {
  constructor(db) {
    this._db = db;
  }

  async create(userData) {
    const hash = await bcrypt.hash(userData.password, SALT_ROUNDS);
    return await this._db.User.create({...userData, password: hash});
  }

  async findByEmail(email) {
    return await this._db.User.findOne({
      ...getSequelizeQueryOptions(`User`, this._db),
      where: {email},
      attributes: [
        `id`,
        `firstName`,
        `lastName`,
        `email`,
        `avatar`,
        `password`,
        `isAdmin`
      ],
    });
  }

  async findAdmin(email) {
    return await this._db.User.findOne({
      where: {
        email,
        isAdmin: true
      },
      ...getSequelizeQueryOptions(`User`, this._db),
    });
  }
}

module.exports = UsersService;
