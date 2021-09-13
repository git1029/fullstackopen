const blogsRouter = require('express').Router()
const userExtractor = require('../utils/middleware').userExtractor
const Blog = require('../models/blog')
const User = require('../models/user')
const ForbiddenError = require('../utils/error').ForbiddenError

blogsRouter.get('/', async (_request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

// NB: only using userExtractor middleware on routes that require token authentication
// ...else will throw errors along all routes if used on blogsRouter or app overall
blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body

  const user = await User.findById(request.user)
  if (!user) {
    throw new ForbiddenError('unknown user')
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  await user.updateOne(
    { $set: { blogs: user.blogs.concat(savedBlog._id) } }
  )

  // // Using save()
  // // NB: triggers custom unique username validation error
  // user.blogs = user.blogs.concat(savedBlog._id)
  // await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = await User.findById(request.user)
  if (!user) {
    throw new ForbiddenError('unknown user')
  }

  const blogToDelete = await Blog.findById(request.params.id)
  if (!blogToDelete) {
    return response.status(404).end()
  }

  if (!(blogToDelete.user.toString() === user._id.toString())) {
    throw new ForbiddenError(
      'you are not permitted to delete another users blog'
    )
  }

  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', userExtractor, async (request, response) => {
  const user = await User.findById(request.user)
  if (!user) {
    throw new ForbiddenError('unknown user')
  }

  // NB: findByIdAndUpdate receives a regular JS object as parameter
  // here we are only allowing update to blog likes
  const blog = {
    likes: request.body.likes
  }

  const blogToUpdate = await Blog.findById(request.params.id)
  if (!blogToUpdate) {
    return response.status(404).end()
  }

  if (!(blogToUpdate.user.toString() === user._id.toString())) {
    throw new ForbiddenError(
      'you are not permitted to modify another users blog'
    )
  }

  const updatedBlog = await Blog
    .findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})

module.exports = blogsRouter