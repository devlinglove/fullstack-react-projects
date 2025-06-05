const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { User } = require('../db/models/user')

async function createUser({ username, password }) {
  const hashedPassword = await bcrypt.hash(password, 10)
  const newUser = new User({ username, password: hashedPassword })
  return await newUser.save()
}

async function getUserByUserName(username) {
  return await User.findOne({ username: username })
}

async function loginUser({ username, password }) {
  const user = await User.findOne({ username: username })
  if (!user) {
    throw new Error('invalid username!')
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password)
  if (!isPasswordCorrect) {
    throw new Error('invalid password!')
  }

  const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  })

  return token
}

module.exports = {
  createUser,
  getUserByUserName,
  loginUser,
}
