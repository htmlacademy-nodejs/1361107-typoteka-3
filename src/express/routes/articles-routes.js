"use strict";

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);
const {formatDate, catchAsync, getPageList} = require(`../../utils`);
const {
  PAGINATION_OFFSET,
  UPLOAD_DIR,
  HttpCode,
  UserErrorMessage,
} = require(`../../constants`);
const adminRoute = require(`../middleware/admin-route`);
const idValidator = require(`../../service/cli/server/middleware/id-validator`);

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

articlesRouter.get(
    `/category/:id`,
    idValidator,
    catchAsync(async (req, res) => {
      const {user} = req.session;
      const page = Number(req.query.page) || 1;
      const {id} = req.params;
      const {count, articles} = await api.getArticlesByCategory(page, id);
      const categories = await api.getCategories();
      const searchedCategory = categories.find(
          (category) => category.id === Number(id)
      );
      const maxPage = Math.ceil(count / PAGINATION_OFFSET);
      const pageList = getPageList(page, maxPage);
      return res.render(`articles-by-category`, {
        page,
        maxPage,
        pageList,
        articles,
        searchedCategory,
        count,
        categories,
        formatDate,
        user,
      });
    })
);

articlesRouter.get(
    `/add`,
    adminRoute,
    catchAsync(async (req, res) => {
      const {user} = req.session;
      const categories = await api.getCategories();
      const [currentDate] = formatDate(new Date()).split(`,`);
      res.render(`new-article`, {
        categories,
        currentDate,
        user,
      });
    })
);

articlesRouter.get(
    `/edit/:id`,
    [adminRoute, idValidator],
    catchAsync(async (req, res) => {
      const {user} = req.session;
      const {id} = req.params;
      const [article, categories] = await Promise.all([
        api.getArticle(id),
        api.getCategories(),
      ]);
      res.render(`edit-article`, {article, categories, formatDate, user});
    })
);

articlesRouter.post(
    `/edit/:id`,
    [adminRoute, idValidator, upload.single(`picture`)],
    catchAsync(async (req, res) => {
      const {user} = req.session;
      const {id} = req.params;
      const {body, file} = req;
      const articleData = {
        title: body.title,
        announce: body.announce,
        fullText: body.fullText,
        categories: body.categories || [],
      };
      if (typeof articleData.categories === `string`) {
        articleData.categories = [articleData.categories];
      }
      if (body.loadedPicture) {
        articleData.picture = body.loadedPicture;
      }
      if (file) {
        articleData.picture = file.filename;
      }
      try {
        await api.updateArticle(id, articleData, user.email);
        res.redirect(`/articles/${id}`);
      } catch (error) {
        const {details: errorDetails} = error.response.data.error;
        const [article, categories] = await Promise.all([
          api.getArticle(id),
          api.getCategories(),
        ]);
        res.render(`edit-article`, {
          article: {
            ...article,
            ...articleData,
            picture: articleData.picture || article.picture,
            loadedPicture: file ? file.filename : null,
          },
          formatDate,
          categories,
          errorDetails,
          user,
        });
      }
    })
);

articlesRouter.get(
    `/:id`,
    idValidator,
    catchAsync(async (req, res) => {
      const {id} = req.params;
      const {user} = req.session;

      const article = await api.getArticle(id);
      const categories = await api.getCategories();

      res.render(`article`, {article, formatDate, categories, user});
    })
);

articlesRouter.post(
    `/:id/comments`,
    idValidator,
    catchAsync(async (req, res) => {
      const {id} = req.params;
      const {body} = req;
      const {user} = req.session;
      if (!user) {
        res.status(HttpCode.FORBIDDEN).render(`errors/400`, {
          statusCode: HttpCode.FORBIDDEN,
          message: UserErrorMessage.FORBIDDEN,
        });
        return;
      }
      const commentData = {
        userId: user.id,
        text: body.text,
      };
      try {
        await api.createComment(id, commentData, user.email);
        res.redirect(`/articles/${id}`);
      } catch (error) {
        const {details: errorDetails} = error.response.data.error;
        const article = await api.getArticle(id);
        res.render(`article`, {
          article,
          formatDate,
          prevCommentData: {text: commentData.text},
          errorDetails,
          user,
        });
      }
    })
);

articlesRouter.post(
    `/add`,
    [adminRoute, upload.single(`picture`)],
    catchAsync(async (req, res) => {
      const {user} = req.session;
      const {body, file} = req;
      const articleData = {
        title: body.title,
        announce: body.announce,
        fullText: body.fullText,
        categories: body.categories || [],
      };
      if (file) {
        articleData.picture = file.filename;
      }
      if (typeof articleData.categories === `string`) {
        articleData.categories = [articleData.categories];
      }
      try {
        await api.createArticle(articleData, user.email);
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
          user,
        });
      }
    })
);

articlesRouter.get(
    `/:articleId/delete-comment/:commentId`,
    [idValidator, adminRoute],
    catchAsync(async (req, res) => {
      const {user} = req.session;
      const {articleId, commentId} = req.params;
      await api.deleteComment(articleId, commentId, user.email);
      res.redirect(`/my/comments`);
    })
);

articlesRouter.get(
    `/delete/:id`,
    [idValidator, adminRoute],
    catchAsync(async (req, res) => {
      const {user} = req.session;
      const {id} = req.params;
      await api.deleteArticle(id, user.email);
      res.redirect(`/my`);
    })
);

module.exports = articlesRouter;
