const {
  selectArticles,
  selectArticleById,
} = require("../1-models/articles-model");

exports.getArticles = (req, res, next) => {
  selectArticles()
    .then((articles) => {
        console.log(articles)
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};