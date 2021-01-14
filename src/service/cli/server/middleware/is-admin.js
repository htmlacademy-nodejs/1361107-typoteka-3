"use strict";

const {HttpCode, UserErrorMessage} = require(`../../../../constants`);
const {AppError, catchAsync} = require(`../../../../utils`);

module.exports = (usersService) => catchAsync(async (req, res, next) => {
  const {userEmail} = req.query;
  console.log(userEmail);
  const result = await usersService.findAdmin(userEmail);

  console.log(result);

  if (!result) {
    return next(new AppError(UserErrorMessage.FORBIDDEN, HttpCode.FORBIDDEN));
  }

  return next();
});
