import React, { useState } from 'react'

const Blog = ({ blog, handleLike, handleDelete, user }) => {
  const [showDetails, setShowDetails] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  const likeBlog = () => {
    handleLike(blog.id, { likes: blog.likes + 1 })
  }

  const deleteBlog = () => {
    if (window.confirm(
      `Remove blog ${blog.title} by ${blog.author}?`
    )) {
      handleDelete(blog.id)
    }
  }

  const showLike = () => {
    if (user && blog.user.username !== user.username) {
      return (
        <button onClick={likeBlog}>like</button>
      )
    }
  }

  const showRemove = () => {
    if (blog.user.username === user.username) {
      return (
        <button onClick={deleteBlog}>remove</button>
      )
    }
  }

  const details = () => (
    <div>
      <div>{blog.url}</div>
      <div>
        likes {blog.likes}
        {showLike()}
      </div>
      <div>{blog.user.username}</div>
      {showRemove()}
    </div>
  )

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={toggleDetails}>
        {showDetails ? 'hide' : 'view'}
      </button>
      {showDetails && details()}
    </div>
  )
}

export default Blog