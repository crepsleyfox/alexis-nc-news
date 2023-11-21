const { selectArticles, selectArticleById } = require("../1-models/articles-model")


exports.getArticles = (req, res, next) => {
    selectArticles()
    .then((articles) => {
        res.status(200).send({ articles })
    })
    .catch(next)
}

exports.getArticleById = (req, res, next) => {    
    const { article_id } = req.params
   
    if (isNaN(article_id) || article_id <= 0) {
        res.status(400).send({message: 'Invalid Article ID'})
        
    } else {
        selectArticleById(article_id)
        .then((article) => {
            res.status(200).send({ article })
        })
        .catch(next) 
    }
}