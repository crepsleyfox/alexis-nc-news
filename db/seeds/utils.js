const db = require("../connection")
const format = require("pg-format")

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createRef = (arr, key, value) => {
  return arr.reduce((ref, element) => {
    ref[element[key]] = element[value];
    return ref;
  }, {});
};

exports.formatComments = (comments, idLookup) => {
  return comments.map(({ created_by, belongs_to, ...restOfComment }) => {
    const article_id = idLookup[belongs_to];
    return {
      article_id,
      author: created_by,
      ...this.convertTimestampToDate(restOfComment),
    };
  });
};
exports.checkUserExists = (username) => {
  const queryString = `SELECT * FROM users WHERE username = $1`;

  return db.query(queryString, [username]).then(({ rows }) => {
    return rows.length > 0;
  });
};

exports.checkExists = (table, column, value) => {
  if (!value) {
    return Promise.resolve(null);
  } else {
    const queryString = format(`SELECT * FROM %I WHERE %I = $1;`, table, column);

    return db.query(queryString, [value])
      .then((doesExist) => {
        const exists = doesExist.rows.length > 0;

        if (!exists) {
          return Promise.reject({ status: 404, message: "Resource Not Found" });
        }

        return exists;
      });
  }
};


