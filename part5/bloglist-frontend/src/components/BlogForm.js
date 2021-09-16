import React, { useState } from 'react'
import FormInput from './FormInput'
import PropTypes from 'prop-types'

const BlogForm = ({ addBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const createBlog = (event) => {
    event.preventDefault()

    addBlog({
      title: title,
      author: author,
      url: url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h3>Create new blog</h3>
      <form onSubmit={createBlog}>
        <FormInput
          label='Title: '
          name='Title'
          type='text'
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
        <FormInput
          label='Author: '
          name='Author'
          type='text'
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        />
        <FormInput
          label='Url: '
          name='Url'
          type='text'
          value={url}
          onChange={({ target }) => setUrl(target.value)}
        />
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  addBlog: PropTypes.func.isRequired
}

export default BlogForm