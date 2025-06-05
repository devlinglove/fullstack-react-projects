import { MongoMemoryServer } from 'mongodb-memory-server'
//const { MongoMemoryServer } = require('mongodb-memory-server')

export default async function globalSetup() {
  const instance = await MongoMemoryServer.create({
    binary: '6.0.4',
  })

  global.__MONGOINSTANCE = instance
  process.env.DATABASE_URL = instance.getUri()
}

// module.exports = {
//   globalSetup,
// }
