const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const ValidationError = require('../utils/error').ValidationError

usersRouter.get('/', async (_request, response) => {
  const users = await User
    .find({})
    .populate('blogs', { title: 1, url: 1 })

  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const body = request.body

  // Need to validate password here before hash
  if (!body.password) {
    throw new ValidationError(
      '`password` is required.'
    )
  }
  else if (body.password.length < 8) {
    throw new ValidationError(
      '`password` must be at least 8 characters.'
    )
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

usersRouter.delete('/:id', async (request, response) => {
  const deletedUser = await User.findByIdAndRemove(request.params.id)
  if (deletedUser) {
    response.status(204).end()
  } else {
    response.status(404).end()
  }
})

module.exports = usersRouter