const db = require("../db/connection");

const { selectArticleById } = require("./articles-model");
const { checkUserExists } = require("./users-model.js");

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

exports.insertComment = (username, body, article_id) => {
  return checkUserExists(username).then((userExists) => {
    if (!userExists) {
      return Promise.reject({ status: 404, message: "User Not Found" });
    }

    return selectArticleById(article_id).then(() => {
      const queryString = `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *`;

      return db
        .query(queryString, [username, body, article_id])
        .then(({ rows }) => {
          return rows[0];
        });
    });
  });
};

exports.deleteCommentbyId = (comment_id) => {
  const checkForDeletionQueryString = db.query(
    `SELECT * FROM comments WHERE comment_id = $1;`,
    [comment_id]
  );

  const deleteQueryString = db.query(
    `DELETE FROM comments WHERE comment_id = $1;`,
    [comment_id]
  );

  return Promise.all([checkForDeletionQueryString, deleteQueryString]).then(
    ([checkResult, deleteResult]) => {
      return [checkResult, deleteResult];
    }
  );
};
