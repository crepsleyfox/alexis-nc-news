const express = require("express");

const app = express();

const { checkServerEndpoints } = require("./1-controllers/api-controller");
const { getTopics } = require("./1-controllers/topics-controller");
const {
  getArticles,
  getArticleById,
  patchArticleVotes,
} = require("./1-controllers/articles-controller");
const {
  handlePsqlErrors,
  handleCustomErrors,
  handleServerErrors,
  handle404,
} = require("./error_handler");
const { getCommentByArticleId, PostComment } = require("./1-controllers/comments-controller");

app.use(express.json());

app.get("/api", checkServerEndpoints);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentByArticleId)

app.post("/api/articles/:article_id/comments", PostComment)

app.patch("/api/articles/:article_id", patchArticleVotes)

app.all("*", handle404);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
