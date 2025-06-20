//import express from 'express'
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const dotenv = require('dotenv')
const { createServer } = require('node:http')
const { Server } = require('socket.io')
const jwt = require('jsonwebtoken')

const { postsRoutes } = require('./routes/posts.js')
//const postRouter = require('./routes/postsRoutes')
const { userRoutes } = require('./routes/users.js')
const { AppError } = require('./utils/appError.js')

const { getUserInfoById } = require('./services/users.js')

const { globalErrorHandler } = require('./utils/globalErrorHandler.js')

dotenv.config()

const app = express()
const server = createServer(app)

const io = new Server(server, {
  cors: {
    origin: '*',
  },
})

io.use(async (socket, next) => {
  if (!socket.handshake.auth?.token) {
    return next(new Error('Authentication failed: no token provided'))
  }

  const decoded = jwt.decode(socket.handshake.auth?.token)
  if (!decoded || !decoded.sub) {
    return next(new Error('Invalid token payload'))
  }

  const user = await getUserInfoById(decoded.sub)
  if (!user || !user.securityStamp) {
    return next(new Error('User not found or missing securityStamp'))
  }

  jwt.verify(
    socket.handshake.auth.token,
    user.securityStamp,
    async (err, decodedToken) => {
      if (err) {
        console.log('------------ss----', err)
        return next(new Error('Authentication failed: invalid token'))
      }
      socket.auth = decodedToken
      socket.user = user
      return next()
    },
  )
})

io.on('connection', (socket) => {
  console.log('user connected:', socket.id)

  const room = socket.handshake.query?.room ?? 'public'
  socket.join(room)
  console.log(socket.id, 'joined room:', room)

  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id)
  })

  console.log('socket------------', socket.user)

  socket.on('chat.message', (message) => {
    console.log(`${socket.id}: ${message}`)
    io.emit('chat.message', {
      username: socket.user.username,
      message,
    })
    // Will send message to all except sender
    // socket.broadcast.emit('chat-message', {
    //   username: socket.user.username,
    //   message,
    // })
    io.to(room).emit('chat-message', {
      username: socket.user.username,
      message,
    })
  })

  socket.on('user.info', async (sockedId, callback) => {
    const sockets = await io.in(sockedId).fetchSockets()
    if (sockets.length == 0) {
      return callback(null)
    }
    const singleSocket = sockets[0]
    const userInfo = {
      sockedId,
      rooms: Array.from(singleSocket.rooms),
      user: socket.user.username,
    }
    return callback(userInfo)
  })
})

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  //res.send('Hello from Express!')
  res.status(200).render('base')
})

postsRoutes(app)
userRoutes(app)

//app.use('/api/v1/posts', postRouter)

app.all('/{*splat}', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

app.use(globalErrorHandler)

module.exports = { app: server }
//export { app }
