const {
  selectCommentsByArticleId,
  insertComment,
  deleteCommentbyId,
} = require("../1-models/comments-model");

exports.getCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  selectCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.PostComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  insertComment(username, body, article_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;

  if (Number(comment_id)) {
    deleteCommentbyId(comment_id)
    .then((deletion) => {
      const deletedData = deletion[0].rows[0];
      if (!deletedData) {
        res.status(404).send({ message: "Comment Id Not Found" });
      } else {
        res.status(204).end()
      } 
    })
  } else {
    res.status(400).send({message: "Bad Request : Wrong Data Type"})
  }
};
