const { expressjwt } = require('express-jwt')
const { getUserByUserById } = require('../services/users.js')
const jwt = require('jsonwebtoken')

const requiredAuth = expressjwt({
  secret: () => process.env.JWT_SECRET,
  algorithms: ['HS256'],
})

const authorize = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid token' })
  }

  const token = authHeader.split(' ')[1]

  try {
    // Step 1
    const decoded = jwt.decode(token)
    if (!decoded || !decoded.sub) {
      return res.status(401).json({ message: 'Invalid token payload' })
    }

    // Step 2
    const user = await getUserByUserById(decoded.sub)
    if (!user || !user.securityStamp) {
      return res
        .status(401)
        .json({ message: 'User not found or missing securityStamp' })
    }

    // Step 3
    const verified = jwt.verify(token, user.securityStamp)

    // Step 4: Attach the user to the request object
    req.auth = verified

    next()
  } catch (err) {
    return res
      .status(401)
      .json({ message: 'Token verification failed', error: err.message })
  }
}

module.exports = {
  requiredAuth,
  authorize,
}
