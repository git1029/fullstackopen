const supertest = require('supertest')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('password', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('login succeeds with correct credentials', async () => {
    const user = {
      username: 'root',
      password: 'password'
    }

    const result = await api
      .post('/api/login')
      .send(user)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(result.body.username).toBe(user.username)
  })

  test('login fails with invalid credentials', async () => {
    const user = {
      username: 'root',
      password: 'wrong'
    }

    const result = await api
      .post('/api/login')
      .send(user)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('invalid username or password')
  })
})

afterAll(() => {
  mongoose.connection.close()
})