"use strict";

const {Router} = require(`express`);
const adminRoute = require(`../middleware/admin-route`);

const categoriesRouter = new Router();

categoriesRouter.get(`/`, adminRoute, (req, res) => res.render(`all-categories`));

module.exports = categoriesRouter;
