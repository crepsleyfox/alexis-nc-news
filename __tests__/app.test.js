const app = require('../app')
const request = require('supertest')
const db = require('../db/connection')
const seed = require("../db/seeds/seed")
const data = require('../db/data/test-data')

beforeEach(() => seed(data))
afterAll(() => db.end())

describe('NC News Server', () => {
    describe('test server is up and running', () => {
        test('GET 200 : /api returns confirmation of running', () => {
            return request(app)
            .get('/api')
            .expect(200)
            .then(({ body }) => {
                expect(body.message).toBe('server is up and running..!')
            })
        })
    })
    describe('GET /api/topics', () => {
        test('GET 200 : /api/topics returns all topics', () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({ body }) => {
                expect(body.topics.length).toBe(3)
                body.topics.forEach((topic) => {
                    expect(typeof topic.description).toBe('string')
                    expect(typeof topic.slug).toBe('string')
                })
            })
           
        })
        test('GET 404 : returns error when given wrong path', () => {
            return request(app)
            .get ('/api/topic')
            .expect(404)
            .then (({ body }) => {
                expect(body.message).toBe('Path Not Found')
            })
        })
    })
})
