const { AppError } = require('./appError')

const handleCastErrorDB = (error) => {
  let message = `Invalid ${error.path}:${error.value}`
  return new AppError(message, 400)
}

const handleDuplicateFieldsDB = (err) => {
  //const value = err.keyValue
  //const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]
  const [key, value] = Object.entries(err.keyValue)[0]
  console.log(value, key)

  const message = `Duplicate field value: ${value}. Please use another value!`
  return new AppError(message, 400)
}

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message)

  const message = `Invalid input data. ${errors.join('. ')}`
  return new AppError(message, 400)
}

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.status).json({
      status: err.status,
      message: err.message,
    })

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('ERROR 💥', err)

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    })
  }
}

const globalErrorHandler = (err, req, res, next) => {
  //console.error('Error:', err, err.name)
  //console.log('Error stack: ', err.stack)

  if (err.name === 'UnauthorizedError') {
    return res.status(401).send({ status: err.status, message: err.message })
  }

  const statusCode = err.status || 500
  const message = err.message || 'Internal Server Error'

  if (process.env.NODE_ENV === 'development') {
    res.status(statusCode).json({
      status: statusCode,
      error: err,
      message: message,
      stack: err.stack,
    })
  }
  if (process.env.NODE_ENV === 'production') {
    let error = { ...err, name: err.name }

    if (err.name === 'CastError') {
      error = handleCastErrorDB(error)
    }
    if (error.code === 11000) {
      error = handleDuplicateFieldsDB(error)
    }
    if (error.name === 'ValidationError') {
      error = handleValidationErrorDB(error)
    }

    sendErrorProd(error, res)
  }
}

module.exports = { globalErrorHandler }
