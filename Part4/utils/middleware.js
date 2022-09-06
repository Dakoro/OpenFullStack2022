const jwt = require('jsonwebtoken')
const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:', request.path)
  logger.info('Body:', request.body)
  logger.info('---')
  next()
}
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

const tokenExtractor = (request, response, next) => {
  // extract token from the request headers

  request.token = getTokenFrom(request)
  console.log(request.token)
  next()
}

const userExtrator = (request, response, next) => {
  // Extract the user that matches the token
  const token = getTokenFrom(request)
  // eslint-disable-next-line no-undef
  const decodedToken = jwt.verify(token, process.env.SECRET)
  request.user = decodedToken
  console.log(request.user)
  next()
}

const unknownEndPoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformated id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' })
  }

  logger.error(error.message)
  next(error)
}



module.exports = {
  requestLogger,
  tokenExtractor,
  userExtrator,
  unknownEndPoint,
  errorHandler
}