const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const jwt = require('jsonwebtoken')
const config = require('../utils/config')

const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
  // Reset Blog collection
  await Blog.deleteMany({})
  // for (let blog of helper.initialBlogs) {
  //   let blogObject = new Blog(blog)
  //   await blogObject.save()
  // }
  await Blog.insertMany(helper.initialBlogs)

  // Reset User collection
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('password', 10)
  const initialUsers = helper.initialUsers.map(u => {
    return {
      ...u,
      passwordHash
    }
  })
  await User.insertMany(initialUsers)
})

describe('where there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('blogs have a defined id', async () => {
    const response = await api.get('/api/blogs')

    const blogToCheck = response.body[0]
    expect(blogToCheck.id).toBeDefined()
  })
})

describe('viewing a specific blog', () => {
  test('succeeds with a valid id', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const blogToView = blogsAtStart[0]

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(resultBlog.body.title).toBe(blogToView.title)
    expect(resultBlog.body.user).toBe(blogToView.user.toString())
  })

  test('fails with statuscode 404 if blog does not exist', async () => {
    const nonExistingBlogId = await helper.nonExistingBlogId()

    await api
      .get(`/api/blogs/${nonExistingBlogId}`)
      .expect(404)
  })

  test('fails with statuscode 400 if id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api
      .get(`/api/blogs/${invalidId}`)
      .expect(400)
  })
})


describe('addition of a new blog', () => {
  test('succeeds with valid data and token', async () => {
    const newBlog = {
      title: 'async/await simplifies making async calls',
      author: 'Bob Smith',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function',
    }

    const user = {
      username: 'root',
      password: 'password'
    }

    const login = await api
      .post('/api/login')
      .send(user)
      .expect(200)

    const result = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${login.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).toContain(newBlog.title)

    expect(result.body.likes).toBe(0)
  })

  test('fails with status code 400 if data invalid', async () => {
    const newBlog = {
      author: 'anonymouse',
      likes: 1
    }

    const user = {
      username: 'root',
      password: 'password'
    }

    const login = await api
      .post('/api/login')
      .send(user)
      .expect(200)

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${login.body.token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('fails with status code 401 if token invalid', async () => {
    const newBlog = {
      title: 'async/await simplifies making async calls',
      author: 'Bob Smith',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function',
      likes: 1
    }

    const result = await api
      .post('/api/blogs')
      .set('Authorization', 'bearer aaaaaaaaaa.bbbbbbbbbbb.cccccccccccc')
      .send(newBlog)
      .expect(401)

    expect(result.body.error).toContain('invalid token')
  })

  test('fails with status code 403 if unknown user', async () => {
    const newBlog = {
      title: 'async/await simplifies making async calls',
      author: 'Bob Smith',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function',
      likes: 1
    }

    const unknownUser = {
      username: 'anonymous',
      id: await helper.nonExistingUserId()
    }

    const token = jwt.sign(
      unknownUser,
      config.SECRET
    )

    const result = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(403)

    expect(result.body.error).toContain('unknown user')
  })
})


describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id and token is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    const user = await User.findById(blogToDelete.user)
    const userToLogin = {
      username: user.username,
      password: 'password'
    }

    const login = await api
      .post('/api/login')
      .send(userToLogin)
      .expect(200)

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `bearer ${login.body.token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )

    const titles = blogsAtEnd.map(b => b.title)

    expect(titles).not.toContain(blogToDelete.title)
  })

  test('fails with statuscode 400 if id is invalid', async () => {
    const invalidBlogId = '5a3d5da59070081a82a3445'

    const users = await helper.usersInDb()
    const userToLogin = {
      username: users[0].username,
      password: 'password'
    }

    const login = await api
      .post('/api/login')
      .send(userToLogin)
      .expect(200)

    await api
      .delete(`/api/blogs/${invalidBlogId}`)
      .set('Authorization', `bearer ${login.body.token}`)
      .expect(400)
  })

  test('fails with statuscode 403 if blog does not belong to user', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    const user = await User.findOne({ _id: { $ne: blogToDelete.user } })
    const userToLogin = {
      username: user.username,
      password: 'password'
    }

    const login = await api
      .post('/api/login')
      .send(userToLogin)
      .expect(200)

    const result = await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `bearer ${login.body.token}`)
      .expect(403)

    expect(result.body.error).toContain(
      'not permitted to delete another users blog'
    )

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('fails with statuscode 404 if blog does not exist', async () => {
    const nonExistingBlogId = await helper.nonExistingBlogId()

    const users = await helper.usersInDb()
    const userToLogin = {
      username: users[0].username,
      password: 'password'
    }

    const login = await api
      .post('/api/login')
      .send(userToLogin)
      .expect(200)

    await api
      .delete(`/api/blogs/${nonExistingBlogId}`)
      .set('Authorization', `bearer ${login.body.token}`)
      .expect(404)
  })
})


describe('updating a blog', () => {
  test('succeeds with status code 200 if id and token is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const user = await User.findById(blogToUpdate.user)
    const userToLogin = {
      username: user.username,
      password: 'password'
    }

    const login = await api
      .post('/api/login')
      .send(userToLogin)
      .expect(200)

    const updatedBlog = {
      likes: blogToUpdate.likes + 1
    }

    const result = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `bearer ${login.body.token}`)
      .send(updatedBlog)
      .expect(200)

    expect(result.body.likes).toBe(blogToUpdate.likes + 1)
  })

  test('fails with statuscode 400 if id is invalid', async () => {
    const invalidBlogId = '5a3d5da59070081a82a3445'

    const users = await helper.usersInDb()
    const userToLogin = {
      username: users[0].username,
      password: 'password'
    }

    const login = await api
      .post('/api/login')
      .send(userToLogin)
      .expect(200)

    await api
      .put(`/api/blogs/${invalidBlogId}`)
      .set('Authorization', `bearer ${login.body.token}`)
      .send({ likes: 99 })
      .expect(400)
  })

  test('fails with statuscode 403 if blog does not belong to user', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const user = await User.findOne({ _id: { $ne: blogToUpdate.user } })
    const userToLogin = {
      username: user.username,
      password: 'password'
    }

    const login = await api
      .post('/api/login')
      .send(userToLogin)
      .expect(200)

    const updatedBlog = {
      likes: blogToUpdate.likes + 1
    }

    const result = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `bearer ${login.body.token}`)
      .send(updatedBlog)
      .expect(403)

    expect(result.body.error).toContain(
      'not permitted to modify another users blog'
    )
  })

  test('fails with statuscode 404 if blog does not exist', async () => {
    const nonExistingBlogId = await helper.nonExistingBlogId()

    const users = await helper.usersInDb()
    const userToLogin = {
      username: users[0].username,
      password: 'password'
    }

    const login = await api
      .post('/api/login')
      .send(userToLogin)
      .expect(200)

    await api
      .put(`/api/blogs/${nonExistingBlogId}`)
      .set('Authorization', `bearer ${login.body.token}`)
      .send({ likes: 99 })
      .expect(404)
  })
})

afterAll(() => {
  mongoose.connection.close()
})