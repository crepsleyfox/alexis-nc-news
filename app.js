const express = require('express')

const { checkServerUp } = require('./1-controllers/server-controller')

const app = express()


app.get('/api', checkServerUp)















module.exports = app
