const express = require('express')

const app = express()

const { checkServerEndpoints } = require('./1-controllers/api-controller')
const { getTopics } = require('./1-controllers/topics-controller')
const { handleCustomErrors, handlePsqlErrors, handleServerErrors, handle404 } = require('./error_handler')

app.use(express.json())

app.get('/api', checkServerEndpoints)

app.get('/api/topics', getTopics)


app.all('*', handle404)

















module.exports = app
