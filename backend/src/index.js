//import dotenv from 'dotenv'
//import { app } from './app.js'
//import { initialDatabase } from './db/init.js'

const { app } = require('./app.js')
const { initialDatabase } = require('./db/init.js')

// try {
//   await initialDatabase()
//   const PORT = process.env.PORT || 5000
//   app.listen(PORT, () => {
//     console.info(`express server running on http://localhost:${PORT}`)
//   })
// } catch (err) {
//   console.error('error connecting to database:', err)
// }

async function startServer() {
  try {
    await initialDatabase()
  } catch (err) {
    console.error('error connecting to database:', err)
  }

  const PORT = process.env.PORT || 5000

  const server = app.listen(PORT, () => {
    console.info(`express server running on http://localhost:${PORT}`)
  })

  process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...')
    console.log(err.name, err.message)
    server.close(() => {
      process.exit(1)
    })
  })
}

startServer()
