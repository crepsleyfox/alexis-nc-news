const { selectCommentsByArticleId } = require("../1-models/comments-model")


exports.getCommentByArticleId = (req, res, next) => {
    const { article_id } = req.params

    selectCommentsByArticleId(article_id)
    .then((comments) => {
        console.log(comments)
        res.status(200).send({ comments })
    })
    .catch(next)
}