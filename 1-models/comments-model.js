const db = require("../db/connection");

exports.selectCommentsByArticleId = (article_id) => {
    const queryString = `
        SELECT comment_id, votes, created_at, author, body, article_id
        FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC;`

    return db.query(queryString, [article_id]).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, message: "Article Not Found, comments cannot exist" });
          } else {
            return rows;
          }
        });
}