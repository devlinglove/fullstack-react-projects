const {
  getUserByUserName,
  createUser,
  loginUser,
} = require('../services/users')

function userRoutes(app) {
  app.post('/api/v1/users/signup', async (req, res) => {
    const { username } = req.body

    // try {
    //   const user = await getUserByUserName(username)
    //   console.log('user', user)
    //   if (user) {
    //     return res.status(409).json({
    //       statusCode: 409,
    //       message: 'failed to create the user,does the username already exist?',
    //     })
    //   }
    //   const createdUser = await createUser(req.body)
    //   return res.json(createdUser)
    // } catch (error) {
    //   console.error('error creating user', error)
    //   return res.status(500).end()
    // }

    try {
      const user = await createUser(req.body)
      return res.status(201).json({ username: user.username })
    } catch (err) {
      return res.status(400).json({
        status: 400,
        error: 'failed to create the user, does the username already exist?',
      })
    }
  })

  app.post('/api/v1/users/login', async (req, res) => {
    try {
      const token = await loginUser(req.body)
      res.json({ token: token })
    } catch (error) {
      console.log('-----------', error)
      return res.status(400).send({
        status: 400,
        error: 'login failed, did you enter the correct username/password?',
      })
    }
  })
}

module.exports = { userRoutes }
