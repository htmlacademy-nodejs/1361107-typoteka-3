"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const api = require(`../api`).getAPI();
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);
const {getTime} = require(`../../utils`);
const renderNewArticleForm = require(`../middleware/render-new-article-form`);

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
articlesRouter.get(`/add`, renderNewArticleForm);
articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  try {
    const [article, categories] = await Promise.all([
      api.getArticle(id),
      api.getCategories(),
    ]);
    res.render(`edit-article`, {article, categories});
  } catch (error) {
    res.status(HttpCode.NOT_FOUND).render(`errors/400`);
  }
});
articlesRouter.get(`/:id`, (req, res) => res.render(`article`));
articlesRouter.post(`/add`, upload.single(`picture`), async (req, res) => {
  const {body, file} = req;
  const currentTime = getTime(new Date());
  const articleData = {
    title: body.title,
    announce: body.announce,
    fullText: body.fullText,
    createdDate: `${body.createdDate}, ${currentTime}`,
    category: body.category,
  };
  if (file) {
    articleData.picture = file.filename;
  }
  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (error) {
    req.body = {...articleData, createdDate: body.createdDate};
    renderNewArticleForm(req, res);
  }
});

module.exports = articlesRouter;
