//import mongoose from 'mongoose'
const mongoose = require('mongoose')

const DATABASE_URL = 'mongodb://localhost:27017/blog'

function initialDatabase() {
  mongoose.connection.on('open', () => {
    console.info('successfully connected to database:', DATABASE_URL)
  })
  // This return Promise of being connected
  return mongoose.connect(DATABASE_URL)
}

module.exports = { initialDatabase }
