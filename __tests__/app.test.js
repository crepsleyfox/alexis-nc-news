const app = require('../app')
const request = require('supertest')
const db = require('../db/connection')
const seed = require("../db/seeds/seed")
const data = require('../db/data/test-data')

beforeEach(() => seed(data))
afterAll(() => db.end())

describe('NC News Server', () => {
    describe('tet server is up and running', () => {
        test('GET 200 : /api returns confirmation of running', () => {
            return request(app)
            .get('/api')
            .expect(200)
            .then(({ body }) => {
                expect(body.message).toBe('server is up and running..!')
            })
        })
    })
})