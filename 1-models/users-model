const db = require("../db/connection");

exports.checkUserExists = (username) => {
  const queryString = `SELECT * FROM users WHERE username = $1`;

  return db.query(queryString, [username]).then(({ rows }) => {
    
    return rows.length > 0
  });
};
