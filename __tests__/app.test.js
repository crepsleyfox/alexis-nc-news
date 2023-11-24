const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const endpoints = require("../endpoints.json");
require("jest-sorted");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("NC News Server", () => {
  describe("ALL 404 errors", () => {
    test("GET 404 : invalid path for all endpoints", () => {
      return request(app)
        .get("/invalid-path-to-any-endpoint")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Path Not Found");
        });
    });
  });
  describe("GET CUSTOM ERRORS", () => {
    test("GET 400 : /api/articles/:article_id with an invalid article ID format", () => {
      return request(app)
        .get("/api/articles/invalid-id-format")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad Request : Wrong Data Type");
        });
    });
    test("GET 404 : valid path but article does not exist", () => {
      return request(app)
        .get("/api/articles/1000")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Article Not Found");
        });
    });
    test("GET 400 : /api/articles/invalid-id-format/comments with an invalid article ID format", () => {
      return request(app)
        .get("/api/articles/invalid-id-format/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad Request : Wrong Data Type");
        });
    });
    test("GET 404 : valid path but article does not exist", () => {
      return request(app)
        .get("/api/articles/1000/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Article Not Found");
        });
    });
    test("GET 400 : returns error when invalid topic is given", () => {
      return request(app)
      .get("/api/articles?topic=bananana")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Invalid Topic Query")
      })
    })
  });
  describe("POST CUSTOM ERRORS", () => {
    test("POST 404 : returns error if username does not exist", () => {
      const newComment = {
        username: "i am not real",
        body: "body of comment 123",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("users Not Found");
        });
    });
    test("POST 400 : /api/articles/:article_id/comments with missing body of comment", () => {
      const newComment = { username: "lurker" };
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad Request : Wrong Data Type");
        });
    });
    test("POST 400 : /api/articles/:article_id/comments when article_id is wrong format comment", () => {
      const newComment = { username: "lurker", body: "body of comment 123" };
      return request(app)
        .post("/api/articles/wrongformat/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad Request : Wrong Data Type");
        });
    });
    test("POST 404 : /api/articles/:article_id/comments when posting on article that does not exist", () => {
      const newComment = { username: "lurker", body: "body of comment 123" };
      return request(app)
        .post("/api/articles/1000/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Article Not Found");
        });
    });
  });
  describe("PATCH CUSTOM ERRORS", () => {
    test("PATCH 404 : returns error if article does not exist", () => {
      const updatedData = { inc_votes: 10 };
      return request(app)
        .patch("/api/articles/1000")
        .send(updatedData)
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Article Not Found");
        });
    });
    test("PATCH 400 : returns error if inc_votes is missing", () => {
        const updatedData = {};
      return request(app)
        .patch("/api/articles/1")
        .send(updatedData)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad Request : Wrong Data Type");
        });
    })
    test("PATCH 400 : returns error if inc_votes is not a number", () => {
        const updatedData = { inc_votes: 'hello' };
      return request(app)
        .patch("/api/articles/1")
        .send(updatedData)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad Request : Wrong Data Type");
        });
    })   
  });
  describe("DELETE CUSTOM ERRORS", () => {
    test("DELETE 404 : returns error when comment_id does not exist", () => {
      return request(app)
      .delete("/api/comments/10000")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Comment Id Not Found")
      })
    })
    test("DELETE 400 : returns error when invalid comment_id format is given", () => {
      return request(app)
      .delete("/api/comments/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad Request : Wrong Data Type")
      })
    })
  })
  describe("GET /api", () => {
    test("GET 200 : /api returns JSON object with how-to-endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(endpoints);
        });
    });
  });
  describe("GET /api/topics", () => {
    test("GET 200 : /api/topics returns all topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body.topics.length).toBe(3);
          body.topics.forEach((topic) => {
            expect(typeof topic.description).toBe("string");
            expect(typeof topic.slug).toBe("string");
          });
        });
    });
  });
  describe("GET /api/users", () => {
    test("GET 200 : /api/users returns all users", () => {
      return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBe(4)
        body.users.forEach((user) => {
          expect(typeof user.username).toBe('string')
          expect(typeof user.name).toBe('string')
          expect(user.avatar_url).toMatch(/^https?:\/\/\S+$/)
        })
      })
    })
  })
  describe("GET /api/articles", () => {
    test("GET 200 : /api/articles returns all articles without body property", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).toBe(13);
          body.articles.forEach((article) => {
            expect(typeof article.author).toBe("string");
            expect(typeof article.title).toBe("string");
            expect(typeof article.article_id).toBe("number");
            expect(typeof article.topic).toBe("string");
            expect(typeof article.created_at).toBe("string");
            expect(typeof article.votes).toBe("number");
            expect(article.article_img_url).toMatch(/^https?:\/\/\S+$/);
            expect(typeof article.comment_count).toBe("number");
            expect(article.body).toBeUndefined();
          });
        });
    });
    test("GET 200 : /api/articles return all articles sorted in descending order by date created", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).toBe(13);
          expect(body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
  });
  describe("GET QUERY /api/articles returns articles with correct query", () => {
    test("GET 200 : /api/articles?topic gives the articles with the queried topic", () => {
      return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        const {articles} = body
        expect(articles).toHaveLength(1)
        body.articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(article.article_img_url).toMatch(/^https?:\/\/\S+$/);
          expect(typeof article.comment_count).toBe("number");
          expect(article.body).toBeUndefined();
        });
      })
    })
    test.only("GET 200 : /api/articles?topic gives empty array if topic exists but there are no articles about it", () => {
      return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        console.log(body)
        expect(body.articles).toEqual([])
      })
    })
  })
  describe("GET /api/articles/:article_id", () => {
    test("GET 200 : /api/articles/:article_id returns specific article", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.article.author).toBe("butter_bridge");
          expect(body.article.title).toBe(
            "Living in the shadow of a great man"
          );
          expect(body.article.article_id).toBe(1);
          expect(body.article.body).toBe("I find this existence challenging");
          expect(body.article.topic).toBe("mitch");
          expect(body.article.created_at).toBe("2020-07-09T20:11:00.000Z");
          expect(body.article.votes).toBe(100);
          expect(body.article.article_img_url).toBe(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
        });
    });
  });
  describe("GET /api/articles/:article_id/comments", () => {
    test("GET 200 : return all comments for a specific article_id", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments.length).toBe(11);
          body.comments.forEach((comment) => {
            expect(typeof comment.comment_id).toBe("number");
            expect(typeof comment.votes).toBe("number");
            expect(typeof comment.created_at).toBe("string");
            expect(typeof comment.author).toBe("string");
            expect(typeof comment.body).toBe("string");
            expect(typeof comment.article_id).toBe("number");
          });
        });
    });
    test("GET 200 : return all comments for a specific article_id in descending order by date comment was posted", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments.length).toBe(11);
          expect(body.comments).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    test('GET 200 : return "no comments found" when article exists but no comments', () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments.message).toBe(
            "No comments found for this article yet"
          );
        });
    });
  });
  describe("POST /api/articles/:article_id/comments", () => {
    test("POST 201 : adds a comment to a specific article", () => {
      const newComment = { username: "lurker", body: "body of comment 123" };
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          const { comment } = body;
          expect(comment).toHaveProperty("comment_id");
          expect(comment.author).toBe("lurker");
          expect(comment.body).toBe("body of comment 123");
          expect(comment.votes).toBe(0);
          expect(typeof comment.created_at).toBe("string");
        });
    });
  });
  describe("PATCH /api/articles/:article_jd", () => {
    test("PATCH 200 updates the votes of an article with positive votes", () => {
      const updatedData = { inc_votes: 10 };
      return request(app)
        .patch("/api/articles/1")
        .send(updatedData)
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article.author).toBe("butter_bridge");
          expect(article.title).toBe("Living in the shadow of a great man");
          expect(article.article_id).toBe(1);
          expect(article.body).toBe("I find this existence challenging");
          expect(article.topic).toBe("mitch");
          expect(article.created_at).toBe("2020-07-09T20:11:00.000Z");
          expect(article.votes).toBe(110);
          expect(article.article_img_url).toBe(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
        });
    });
    test("PATCH 200 updates the votes of an article with negative votes", () => {
      const updatedData = { inc_votes: -10 };
      return request(app)
        .patch("/api/articles/1")
        .send(updatedData)
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article.author).toBe("butter_bridge");
          expect(article.title).toBe("Living in the shadow of a great man");
          expect(article.article_id).toBe(1);
          expect(article.body).toBe("I find this existence challenging");
          expect(article.topic).toBe("mitch");
          expect(article.created_at).toBe("2020-07-09T20:11:00.000Z");
          expect(article.votes).toBe(90);
          expect(article.article_img_url).toBe(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
        });
    });
  });
  describe("DELETE /api/comments/comment_id", () => {
    test("GET 204 : successful comment deletion and returns status code only", () => {
      return request(app)
        .delete("/api/comments/18")
        .expect(204)
        .then(({ body }) => {
          expect(body).toEqual({})
          
        })
    })
  })
});
