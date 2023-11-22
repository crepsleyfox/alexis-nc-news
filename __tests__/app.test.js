const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const endpoints = require("../endpoints.json");
require('jest-sorted')

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("NC News Server", () => {
  describe("GET * 404 errors", () => {
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
    test("GET 400 : /api/articles/:article_id with an invalid article ID", () => {
      return request(app)
        .get("/api/articles/invalid-id-format")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad Request");
        });
    });
    test("GET 404 : valid path but item does not exist", () => {
      return request(app)
        .get("/api/articles/1000")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Article Not Found");
        });
    });
  });
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
            expect(article.body).toBeUndefined()
          });
        });
    });
    test('GET 200 : /api/articles return all articles sorted in descending order by date created', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
            expect(body.articles.length).toBe(13)
            expect(body.articles).toBeSortedBy('created_at', {descending: true})
        })
    })
  });
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
});
