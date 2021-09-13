const logger = require('./logger')
const jwt = require('jsonwebtoken')
const config = require('./config')

const requestLogger = (request, _response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

// extract authorization token from request header and store in request.token
const tokenExtractor = (request, _response, next) => {
  request.token = null
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  }
  next()
}

// extract user id from token and store in request.user
const userExtractor = (request, _response, next) => {
  const decodedToken = jwt.verify(request.token, config.SECRET)
  request.user = decodedToken.id ? decodedToken.id : null
  next()
}

// handler of requests with unknown endpoint
const unknownEndpoint = (_request, response, next) => {
  response.status(404).send({ error: 'unkown endpoint' })
  next()
}

// handler of requests which result to errors
const errorHandler = (error, _request, response, next) => {
  logger.error(error.name)
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  else if (error.name === 'AuthenticationError') {
    return response.status(401).json({ error: error.message })
  }
  else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' })
  }
  else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' })
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  tokenExtractor,
  userExtractor,
  errorHandler
}