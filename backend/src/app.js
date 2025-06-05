//import express from 'express'
const express = require('express')
const bodyParser = require('body-parser')
var cors = require('cors')

const { postsRoutes } = require('./routes/posts.js')
const { userRoutes } = require('./routes/users.js')

const app = express()
app.use(cors())
app.use(bodyParser.json())

postsRoutes(app)
userRoutes(app)

app.get('/', (req, res) => {
  res.send('Hello from Express!')
})

module.exports = { app }
//export { app }
