'use strict';

const {Model, DataTypes} = require(`sequelize`);

module.exports = (sequelize) => {
  class User extends Model {}
  User.init({
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    timestamps: true,
    paranoid: true,
  });

  return User;
};
