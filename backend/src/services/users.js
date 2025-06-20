const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { User } = require('../db/models/user')

async function createUser({ username, password }) {
  const hashedPassword = await bcrypt.hash(password, 10)
  const newUser = new User({ username, password: hashedPassword })
  newUser.updateSecurityStamp()
  return await newUser.save()
}

async function getUserByUserNameWithPosts(username) {
  return await User.findOne({ username: username })
    .select('-password')
    .populate('posts')
}

async function getUserByUserName(username) {
  return await User.findOne({ username: username }).select('-password')
}

async function getUserByUserById(id) {
  return await User.findOne({ _id: id }).select('-password')
}

async function loginUser({ username, password }) {
  const dbUser = await User.findOne({ username: username })
  if (!dbUser) {
    throw new Error('invalid username!')
  }

  const isPasswordCorrect = await bcrypt.compare(password, dbUser.password)
  if (!isPasswordCorrect) {
    throw new Error('invalid password!')
  }

  const token = jwt.sign({ sub: dbUser._id }, dbUser.securityStamp, {
    expiresIn: process.env.ACCESS_TOKEN_LIFE,
  })

  // const refreshToken = jwt.sign(
  //   { sub: user._id },
  //   process.env.REFRESH_TOKEN_SECRET,
  //   {
  //     expiresIn: process.env.REFRESH_TOKEN_LIFE,
  //   },
  // )

  const { password: excludePass, securityStamp, ...user } = dbUser._doc

  return { user, token }
}

async function findByIdUser(userId) {
  return await User.findById({ _id: userId })
}

async function deleteUser(userId) {
  return await User.deleteOne({ _id: userId })
}

async function getUserInfoById(userId) {
  try {
    const user = await User.findById(userId)
    if (!user) return { username: userId }
    return { username: user.username, securityStamp: user.securityStamp }
  } catch (err) {
    return { username: userId }
  }
}

module.exports = {
  createUser,
  getUserByUserName,
  loginUser,
  deleteUser,
  findByIdUser,
  getUserByUserById,
  getUserInfoById,
}
