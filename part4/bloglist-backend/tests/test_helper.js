const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
    user: '613f3e665f431c51baa35989'
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
    user: '613f31918eefbb589d7584fc'
  }
]

const initialUsers = [
  {
    _id: '613f3e665f431c51baa35989',
    username: 'root',
    name: 'Superuser',
    blogs: [
      '5a422a851b54a676234d17f7'
    ]
  },
  {
    _id: '613f31918eefbb589d7584fc',
    username: 'mluukkai',
    name: 'Matti Lukkainen',
    blogs: [
      '5a422aa71b54a676234d17f8'
    ]
  },
]

const nonExistingUserId = async () => {
  const user = new User({
    username: 'anonymous',
    passwordHash: 'notarealhash'
  })

  await user.save()
  await user.remove()

  return user._id.toString()
}

const nonExistingBlogId = async () => {
  const blog = new Blog({
    title: 'willremovethissoon',
    author: 'anonymous',
    url: 'http://localhost:3001'
  })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialUsers,
  initialBlogs,
  nonExistingUserId,
  nonExistingBlogId,
  blogsInDb,
  usersInDb
}