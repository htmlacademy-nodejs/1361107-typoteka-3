"use strict";

module.exports = (req, res, next) => {
  const {user} = req.session;

  if (!user.isAdmin) {
    res.redirect(`/`);
  }

  return next();
};
