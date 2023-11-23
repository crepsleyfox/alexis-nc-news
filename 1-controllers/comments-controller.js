const { selectCommentsByArticleId, insertComment } = require("../1-models/comments-model");

exports.getCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  selectCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.PostComment = (req, res, next) => {
    const { article_id } = req.params
    const {username, body} = req.body
    
    insertComment(username, body, article_id)
    .then((comment) => {
        
        res.status(201).send({ comment })
    })
    .catch(next)
    
}
