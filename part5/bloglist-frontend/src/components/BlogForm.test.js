import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

test('<BlogForm /> updates parent state and calls onSubmit', () => {
  const addBlog = jest.fn()

  const component = render(
    <BlogForm addBlog={addBlog} />
  )

  const inputTitle = component.container.querySelector('#Title')
  const inputAuthor = component.container.querySelector('#Author')
  const inputUrl = component.container.querySelector('#Url')
  const form = component.container.querySelector('form')

  fireEvent.change(inputTitle, {
    target: { value: 'This is a blog title' }
  })
  fireEvent.change(inputAuthor, {
    target: { value: 'Bob Smith' }
  })
  fireEvent.change(inputUrl, {
    target: { value: 'http://localhost:3000' }
  })

  fireEvent.submit(form)

  expect(addBlog.mock.calls).toHaveLength(1)
  expect(addBlog.mock.calls[0][0]).toEqual({
    title: 'This is a blog title',
    author: 'Bob Smith',
    url: 'http://localhost:3000'
  })
})