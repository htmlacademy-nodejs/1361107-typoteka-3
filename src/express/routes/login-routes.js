"use strict";

const {Router} = require(`express`);
const {catchAsync} = require(`../../utils`);
const alreadyRegistered = require(`../middleware/already-registered`);
const api = require(`../api`).getAPI();

const loginRouter = new Router();

loginRouter.get(`/`, alreadyRegistered, (req, res) => res.render(`login`));

loginRouter.post(
    `/`,
    alreadyRegistered,
    catchAsync(async (req, res) => {
      try {
        const user = await api.loginUser(req.body);
        req.session.user = user;
        res.redirect(`/login/processing`);
      } catch (error) {
        const {details: errorDetails} = error.response.data.error;
        res.render(`login`, {
          prevUserEmail: req.body.email,
          errorDetails,
        });
      }
    })
);

loginRouter.get(`/processing`, (req, res) => res.redirect(`/`));

module.exports = loginRouter;
