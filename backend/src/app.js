//import express from 'express'
const express = require('express')
const bodyParser = require('body-parser')
var cors = require('cors')

const { postsRoutes } = require('./routes/posts.js')
//const postRouter = require('./routes/postsRoutes')
const { userRoutes } = require('./routes/users.js')
const { AppError } = require('./utils/appError.js')

const { globalErrorHandler } = require('./utils/globalErrorHandler.js')

const app = express()

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello from Express!')
})

postsRoutes(app)
userRoutes(app)

//app.use('/api/v1/posts', postRouter)

app.all('/{*splat}', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

app.use(globalErrorHandler)

module.exports = { app }
//export { app }
