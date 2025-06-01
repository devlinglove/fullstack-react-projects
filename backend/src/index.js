import dotenv from 'dotenv'
import { app } from './app.js'
import { initialDatabase } from './db/init.js'
dotenv.config()

try {
  await initialDatabase()
  const PORT = process.env.PORT || 5000
  app.listen(PORT, () => {
    console.info(`express server running on http://localhost:${PORT}`)
  })
} catch (err) {
  console.error('error connecting to database:', err)
}
