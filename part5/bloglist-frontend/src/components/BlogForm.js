import React from 'react'
import FormInput from './FormInput'

const BlogForm = (props) => {
  const {
    addBlog,
    title, setTitle,
    author, setAuthor,
    url, setUrl
  } = props

  return (
    <form onSubmit={addBlog}>
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
  )
}

export default BlogForm