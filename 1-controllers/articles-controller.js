const {
  selectArticles,
  selectArticleById,
  updateArticleVotes
} = require("../1-models/articles-model");

exports.getArticles = (req, res, next) => {
  const { topic } = req.query

  selectArticles(topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ articles: article });
    })
    .catch(next);
};

exports.patchArticleVotes = (req, res, next) => {
    const {article_id} = req.params
    const {inc_votes} = req.body

    updateArticleVotes(article_id, inc_votes)
    .then(() => selectArticleById(article_id))
    .then((articleUpdated) => {
        res.status(200).send({article: articleUpdated})
    })
    .catch(next)
}


