const db = require("../db/connection");
const { checkExists } = require("../db/seeds/utils");

exports.selectArticles = (topic) => {
  
  return checkExists("topics", "slug", topic)
    .then((topicExists) => {
      let queryString = `
        SELECT
          articles.author,
          articles.title,
          articles.article_id,
          articles.topic,
          articles.created_at,
          articles.votes,
          articles.article_img_url,
          CAST(COUNT(comments.comment_id) AS INT) comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id 
      `;

      if (topicExists === true) {
        queryString += ` WHERE articles.topic = $1 GROUP BY articles.author, articles.title, articles.article_id ORDER BY articles.created_at DESC;`;

        return db.query(queryString, [topic]).then(({ rows }) => {
          
          return rows;
        });
      } else {
        queryString += ` GROUP BY articles.author, articles.title, articles.article_id ORDER BY articles.created_at DESC;`;

        return db.query(queryString).then(({ rows }) => {
          
          return rows;
        });
      }
    });
};

exports.selectArticleById = (article_id) => {
  const queryString = `
    SELECT
      articles.*,
      CAST((SELECT COUNT(*) FROM comments WHERE comments.article_id = $1) AS INT) as comment_count
    FROM articles 
    WHERE article_id = $1`;

  return db.query(queryString, [article_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, message: "Article Not Found" });
    } else {
      return rows[0];
    }
  });
};

exports.updateArticleVotes = (article_id, inc_votes) => {
  const queryString = `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`;

  return db.query(queryString, [inc_votes, article_id]).then(({ rows }) => {
    return rows[0];
  });
};
