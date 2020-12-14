"use strict";

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);
const {buildQueryString, formatDate, catchAsync} = require(`../../utils`);

const UPLOAD_DIR = `../upload/img/`;

const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  },
});
const upload = multer({storage});

const articlesRouter = new Router();

articlesRouter.get(`/category/:id`, (req, res) =>
  res.render(`articles-by-category`)
);

articlesRouter.get(
    `/add`,
    catchAsync(async (req, res) => {
      const categories = await api.getCategories();
      const currentDate = formatDate(new Date()).split(`,`)[0];
      res.render(`new-article`, {
        categories,
        currentDate,
        prevArticleData: Object.keys(req.query).length === 0 ? null : req.query,
      });
    })
);

articlesRouter.get(
    `/edit/:id`,
    catchAsync(async (req, res) => {
      const {id} = req.params;
      const [article, categories] = await Promise.all([
        api.getArticle(id),
        api.getCategories(),
      ]);
      res.render(`edit-article`, {article, categories, formatDate});
    })
);

articlesRouter.get(`/:id`, (req, res) => res.render(`article`));

articlesRouter.post(
    `/add`,
    upload.single(`picture`),
    catchAsync(async (req, res) => {
      const {body, file} = req;
      const articleData = {
        title: body.title,
        announce: body.announce,
        fullText: body.fullText,
        category: body.category || [],
        userId: 1,
      };
      if (file) {
        articleData.picture = file.filename;
      }
      if (typeof articleData.category === `string`) {
        articleData.category = [articleData.category];
      }
      try {
        await api.createArticle(articleData);
        res.redirect(`/my`);
      } catch (error) {
        res.redirect(
            `/articles/add${buildQueryString({
              ...articleData,
              createdDate: body.createdDate,
            })}`
        );
      }
    })
);

module.exports = articlesRouter;
