const db = require("../db/connection");

exports.selectUsers = () => {
  const queryString = `SELECT * FROM users`;

  return db.query(queryString).then(({ rows }) => {
    return rows;
  });
};

exports.checkUserExists = (username) => {
  const queryString = `SELECT * FROM users WHERE username = $1`;

  return db.query(queryString, [username]).then(({ rows }) => {
    return rows.length > 0;
  });
};
