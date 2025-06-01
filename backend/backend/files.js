import { writeFileSync, readFileSync } from 'node:fs'

const users = [{ name: 'Adam Ondra', email: 'adam.ondra@climb.ing' }]
const jsonUsers = JSON.stringify(users)

writeFileSync('./users.json', jsonUsers)
const readJsonUsers = readFileSync('./users.json')

console.log('read-json-users', JSON.parse(readJsonUsers))
