const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')
const config = require('../utils/config')
const AuthenticationError = require('../utils/error').AuthenticationError

loginRouter.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({ username: body.username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    throw new AuthenticationError('invalid username or password')
  }

  const userForToken = {
    username: user.username,
    id: user._id
  }

  // token expires in 60*60 seconds, that is, in one hour
  const token = jwt.sign(
    userForToken,
    config.SECRET,
    { expiresIn: 60*60 }
  )

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter