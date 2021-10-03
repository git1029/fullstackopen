import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'This is a title',
    author: 'Bob Smith',
    url: 'http://localhost/3000',
    likes: 99,
    user: {
      username: 'bobsmith'
    }
  }

  const user = {
    username: 'mluukkai'
  }

  test('renders blog with correct content', () => {
    const component = render(
      <Blog blog={blog} user={user} />
    )

    expect(component.container).toHaveTextContent('This is a title')
    expect(component.container).toHaveTextContent('Bob Smith')

    const div = component.container.querySelector('.blogDetails')
    expect(div).toBeNull()
  })

  test('clicking the view button displays blog details', () => {
    const component = render(
      <Blog blog={blog} user={user}/>
    )

    const button = component.getByText('view')
    fireEvent.click(button)

    const div = component.container.querySelector('.blogDetails')
    expect(div).toBeDefined()
    expect(div).toHaveTextContent('http://localhost/3000')
    expect(div).toHaveTextContent('likes 99')
  })

  test('clicking the like button twice calls the handler twice', () => {
    const likeBlog = jest.fn()

    const component = render(
      <Blog blog={blog} user={user} handleLike={likeBlog} />
    )

    const viewButton = component.getByText('view')
    fireEvent.click(viewButton)

    const likeButton = component.getByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(likeBlog.mock.calls).toHaveLength(2)
  })
})