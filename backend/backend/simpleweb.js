import { createServer } from 'node:http'
import { readFileSync } from 'node:fs'

const server = createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-type', 'application/json')
  const readJsonUsers = readFileSync('./users.json')
  res.end(readJsonUsers)
})

const PORT = 3001
const HOST = 'localhost'

server.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`)
})
