import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title and author', () => {

  const blog = {
    title: 'render test',
    author: 'Admin',
    likes: 10,
    url: 'http://render-test.com'
  }

  render(<Blog blog={blog} />) // render the component

  const result = screen.getByText(`${blog.title} by ${blog.author}`) // seek the expression in an element
  expect(result).toBeDefined()
  screen.debug() // print the HTML in the console
})

test('clicking the button calls the event handler once', async () => {
  const blog = {
    title: 'render test',
    author: 'Admin',
    likes: 10,
    user: {
      username: 'Arthur'
    },
    url: 'http://render-test.com'
  }


  render(<Blog blog={blog} />)
  screen.debug()
  screen.getByText(`${blog.title} by ${blog.author}`)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  // use of regexp to seek a specific string in a element, otherwise the test return an error
  screen.getByText(/10/i)
  screen.getByText(/http?:\/\/render-test.com/i)
  screen.getByText(/Arthur/i)

})

test('the like button is clicked twice', async () => {
  const blog = {
    title: 'render test',
    author: 'Admin',
    likes: 10,
    user: {
      username: 'Arthur'
    },
    url: 'http://render-test.com'
  }

  const update = jest.fn()

  render(<Blog blog={blog} updateLike={update}/>)
  screen.debug()

  // render all the blog's infos
  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  // first click on the like button
  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  expect(update.mock.calls).toHaveLength(1)

  // second click on the like button
  await user.click(likeButton)
  expect(update.mock.calls).toHaveLength(2)

})
