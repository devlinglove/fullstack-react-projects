const {
  getUserByUserName,
  createUser,
  loginUser,
  deleteUser,
  findByIdUser,
} = require('../services/users')
const { AppError } = require('../utils/appError')
const { catchAsync } = require('../utils/catchAsync')
const jwt = require('jsonwebtoken')
const emailQueue = require('../utils/emailQueue')

function userRoutes(app) {
  app.post(
    '/api/v1/users/signup',
    catchAsync(async (req, res, next) => {
      const { username } = req.body
      const user = await getUserByUserName(username)
      if (user) {
        return next(
          new AppError(
            'failed to create the user,does the username already exist?',
            409,
          ),
        )
      }
      const newUser = await createUser(req.body)
      if (newUser) {
        const confirmToken = jwt.sign(
          { sub: newUser._id },
          newUser.securityStamp,
          {
            expiresIn: '10m',
          },
        )
        const confirmEmailURL = `${req.protocol}://${req.get(
          'host',
        )}/api/v1/users/confirm-email?username=${
          newUser.username
        }&token=${confirmToken}`

        //const message = `Please confirm to: ${confirmEmailURL}.\nIf you didn't forget your password, please ignore this email!`

        // await sendEmailService({
        //   to: newUser.username,
        //   subject: 'Welcom email',
        //   text: message,
        // })

        // await emailQueue.add({
        //   to: newUser.username,
        //   subject: 'Verify Your Email',
        //   text: `Your email verification link is mentioned below.`,
        //   html: `<p>Please confirm to: <a href=${confirmEmailURL}>Confirm email</a>.\nIf you didn't forget your password, please ignore this email!</p>`,
        // })

        await emailQueue.add({
          user: newUser,
          url: confirmEmailURL,
        })
      }
      return res.status(201).json({ username: newUser.username })
    }),
  )

  app.post(
    '/api/v1/users/confirm-email/',
    catchAsync(async (req, res, next) => {
      const { username, token } = req.query
      const user = await getUserByUserName(username)
      if (!user) {
        return next(new AppError('No user found with that email', 400))
      }
      try {
        jwt.verify(token, user.securityStamp)
        user.updateSecurityStamp()
        await user.save()
      } catch (err) {
        return next(new AppError(err.message, 500))
      }
      res.json({
        message: 'Your email has been confirmed successfully.',
      })
    }),
  )

  app.post('/api/v1/users/login', async (req, res) => {
    try {
      const userWithToken = await loginUser(req.body)
      res.json(userWithToken)
    } catch (error) {
      return res.status(400).send({
        status: 400,
        error: 'login failed, did you enter the correct username/password?',
      })
    }
  })

  app.get(
    '/api/v1/users/user',
    catchAsync(async (req, res) => {
      const { username } = req.query
      const user = await getUserByUserName(username)
      res.json(user)
    }),
  )

  app.post(
    '/api/v1/users/forgot-password',
    catchAsync(async (req, res, next) => {
      const { username } = req.body
      const user = await getUserByUserName(username)
      console.log('user---', user)
      if (!user) {
        return next(new AppError('No user found with that email', 400))
      }

      const newSecurityStamp = user.updateSecurityStamp()
      await user.save({ validateBeforeSave: false })

      const resetToken = jwt.sign({ sub: user._id }, newSecurityStamp, {
        expiresIn: '10m',
      })

      const resetURL = `${req.protocol}://${req.get(
        'host',
      )}/api/v1/users/reset-password/?username=${
        user.username
      }&token=${resetToken}`

      const message = `Forgot your password ? Submit a PUT request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`

      await sendEmailService({
        to: user.username,
        subject: 'Forgot Password',
        text: message,
      })

      res.json({
        message: 'Email has been sent successfully. Try to login from there.',
      })
    }),
  )

  app.put(
    '/api/v1/users/reset-password/',
    catchAsync(async (req, res, next) => {
      const { username, token } = req.query
      const user = await getUserByUserName(username)
      if (!user) {
        return next(new AppError('No user found with that email', 400))
      }
      try {
        jwt.verify(token, user.securityStamp)
        user.password = req.body.password
        user.updateSecurityStamp()
        await user.save()
      } catch (err) {
        return next(new AppError(err.message, 500))
      }
      res.json({
        message: 'Your password has been updated successfully.',
      })
    }),
  )

  app.get(
    '/api/v1/users/:id',
    catchAsync(async (req, res, next) => {
      const { id } = req.params
      const user = await findByIdUser(id)
      if (user == null) {
        return next(new AppError('No user found with this id', 404))
      }
      return res.status(200).json(user)
    }),
  )

  app.delete(
    '/api/v1/users/:id',
    catchAsync(async (req, res, next) => {
      const { id } = req.params
      const user = await findByIdUser(id)
      if (user == null) {
        return next(new AppError('No user found with this id', 404))
      }
      await user.deleteOne()
      return res.status(204).end()
    }),
  )
}

module.exports = { userRoutes }
