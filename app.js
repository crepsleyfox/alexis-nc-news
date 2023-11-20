const express = require('express')

const { checkServerUp } = require('./1-controllers/api-controller')
const { getTopics } = require('./1-controllers/topics-controller')
const { handleCustomErrors, handlePsqlErrors, handleServerErrors, handle404 } = require('./error_handler')




const app = express()


app.get('/api', checkServerUp)

app.get('/api/topics', getTopics)


app.all('*', handle404)

app.use(handlePsqlErrors)
app.use(handleCustomErrors)
app.use(handleServerErrors)















module.exports = app
