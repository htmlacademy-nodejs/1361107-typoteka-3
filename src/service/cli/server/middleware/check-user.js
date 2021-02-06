"use strict";

const {HttpCode, UserErrorMessage, ResponseMessage} = require(`../../../../constants`);
const {AppError, catchAsync} = require(`../../../../utils`);

module.exports = (service) => catchAsync(async (req, res, next) => {
  const user = await service.findByEmail(req.query.userEmail);

  if (!user) {
    return next(new AppError(UserErrorMessage.FORBIDDEN, HttpCode.FORBIDDEN));
  }

  if (user.id !== req.body.userId) {
    return next(new AppError(ResponseMessage.BAD_REQUEST, HttpCode.BAD_REQUEST));
  }

  return next();
});
