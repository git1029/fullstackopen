import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials)

      window.localStorage.setItem(
        'loggedInUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      messageUpdate({
        type: 'success',
        text: 'Logged in successfully'
      })
    }
    catch (exception) {
      messageUpdate({
        type: 'error',
        text: 'Wrong username or password'
      })
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedInUser')
    setUser(null)
  }

  const addBlog = async (blogObject) => {
    try {
      const blog = await blogService.create(blogObject)
      blogFormRef.current.toggleVisibility()
      setBlogs(blogs.concat(blog))
      messageUpdate({
        type: 'success',
        text: `A new blog ${blog.title} by ${blog.author} added`
      })
    }
    catch (exception) {
      console.log(exception)
      messageUpdate({
        type: 'error',
        text: 'Something went wrong'
      })
    }
  }

  const handleLike = async (id, blogObject) => {
    try {
      const updatedBlog = await blogService
        .update(id, blogObject)
      setBlogs(blogs.map(b => b.id === updatedBlog.id
        ? updatedBlog
        : b
      ))
    }
    catch (exception) {
      messageUpdate({
        type: 'error',
        text: 'Something went wrong'
      })
    }
  }

  const handleDelete = async (id) => {
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter(b => b.id !== id))
    }
    catch (exception) {
      messageUpdate({
        type: 'error',
        text: 'Something went wrong'
      })
    }
  }

  const messageUpdate = ({ type, text }) => {
    setMessage({ type, text })
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>

        <Notification message={message} />

        <LoginForm handleLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div>
      <h2>Blogs</h2>

      <Notification message={message} />

      <p>
        {user.username} logged in
        <button onClick={handleLogout}>logout</button>
      </p>

      <Togglable buttonLabel='create new blog' ref={blogFormRef}>
        <BlogForm addBlog={addBlog} />
      </Togglable>

      {blogs
        .sort((a, b) => b.likes > a.likes)
        .filter(blog => blog.user)
        .map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            handleLike={handleLike}
            handleDelete={handleDelete}
            user={user}
          />
        )}
    </div>
  )
}

export default App