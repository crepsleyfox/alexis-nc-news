const db = require("../db/connection");

exports.selectArticles = () => {
  const queryString = `SELECT
            articles.author,
            articles.title,
            articles.article_id,
            articles.topic,
            articles.created_at,
            articles.votes,
            articles.article_img_url,
            COUNT(comments.comment_id) AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.author, articles.title, articles.article_id
        ORDER BY articles.created_at DESC;`;

  return db.query(queryString).then(({ rows }) => {
    return rows.map((article) => ({
      ...article,
      comment_count: parseInt(article.comment_count),
    }));
  });
};

exports.selectArticleById = (article_id) => {
  const queryString = `SELECT * FROM articles WHERE article_id = $1;`;

  return db.query(queryString, [article_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, message: "Article Not Found" });
    } else {
      return rows[0];
    }
  });
};
