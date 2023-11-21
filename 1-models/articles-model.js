const db = require('../db/connection')

exports.selectArticles = () => {
    const queryString = `SELECT * FROM articles`

    return db.query(queryString).then(({ rows }) => {
        return rows
    })
}

exports.selectArticleById = (article_id) => {
    
    const queryString = `SELECT * FROM articles WHERE article_id = $1;`

    return db.query(queryString, [article_id])
    .then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, message: 'Not Found'})
        } else {
        return rows[0]
        }
    })
}