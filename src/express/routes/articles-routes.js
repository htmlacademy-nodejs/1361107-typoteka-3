"use strict";

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);
const {formatDate, catchAsync} = require(`../../utils`);

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
      const [currentDate] = formatDate(new Date()).split(`,`);
      res.render(`new-article`, {
        categories,
        currentDate
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

articlesRouter.get(`/:id`, catchAsync(async (req, res) => {
  const {id} = req.params;

  const article = await api.getArticle(id);

  res.render(`article`, {article, formatDate});
}));

articlesRouter.post(
    `/add`,
    upload.single(`picture`),
    catchAsync(async (req, res) => {
      const {body, file} = req;
      const articleData = {
        title: body.title,
        announce: body.announce,
        fullText: body.fullText,
        categories: body.categories || [],
        userId: 1,
      };
      if (file) {
        articleData.picture = file.filename;
      }
      if (typeof articleData.categories === `string`) {
        articleData.categories = [articleData.categories];
      }
      try {
        await api.createArticle(articleData);
        res.redirect(`/my`);
      } catch (error) {
        const {details: errorDetails} = error.response.data.error;
        const categories = await api.getCategories();
        const [currentDate] = formatDate(new Date()).split(`,`);
        res.render(`new-article`, {
          categories,
          currentDate,
          prevArticleData: articleData,
          errorDetails,
        });
      }
    })
);

module.exports = articlesRouter;
