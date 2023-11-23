const db = require("../db/connection");
const { selectArticleById } = require("./articles-model");

exports.selectCommentsByArticleId = (article_id) => {
  return selectArticleById(article_id).then(() => {
    const queryString = `
        SELECT comment_id, votes, created_at, author, body, article_id
        FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC;`;

    return db.query(queryString, [article_id]).then(({ rows }) => {
      if (rows.length === 0) {
        return { message: "No comments found for this article yet" };
      } else {
        return rows;
      }
    });
  });
};
