import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('the event handler is called correctly', async () => {
  const create = jest.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={create} />)
  screen.debug()

  const titleInput = screen.getByPlaceholderText('Title')
  const authorInput = screen.getByPlaceholderText('Author')
  const urlInput = screen.getByPlaceholderText('Url')
  const submitButton = screen.getByText('Create')

  await user.type(titleInput, 'Personal Blog')
  await user.type(authorInput, 'Dakoro')
  await user.type(urlInput, 'http://Dakoro.com')

  await user.click(submitButton)

  expect(create.mock.calls).toHaveLength(1)
  expect(create.mock.calls[0][0].title).toBe('Personal Blog')
  expect(create.mock.calls[0][0].author).toBe('Dakoro')
  expect(create.mock.calls[0][0].url).toBe('http://Dakoro.com')
})