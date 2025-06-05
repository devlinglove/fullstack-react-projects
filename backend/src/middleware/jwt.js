const { expressjwt } = require('express-jwt')

const requiredAuth = expressjwt({
  secret: () => process.env.JWT_SECRET,
  algorithms: ['HS256'],
})

module.exports = {
  requiredAuth,
}
