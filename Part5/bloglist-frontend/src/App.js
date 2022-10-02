import { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [succesMessage, setSuccesMessage] = useState(null)

  useEffect(() => {
    blogService
      .getAll()
      .then(blogs => setBlogs( blogs ))
  }, [])

  useEffect(() => {
    const loggedUserJson = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJson) {
      const user = JSON.parse(loggedUserJson)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const blogFormRef = useRef()

  const addBlog = (newBlog) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(newBlog)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setSuccesMessage(`A new blog ${returnedBlog.title} by ${returnedBlog.author} added.`)
        setTimeout(() => setSuccesMessage(null), 3000)
      })
  }

  const deleteRequest = async(blog) => {
    console.log(blog)
    const message = window.confirm(`Remove blog ${blog.title} by ${blog.author}.`)
    if (message === true) {
      await blogService.deleteBlog(blog.id)
      return alert(`The blog ${blog.title} by ${blog.author} has been deleted.`)
    }
    else return alert(`The blog ${blog.title} by ${blog.author} hasn't been deleted.`)
  }

  const updateLike = async(blog) => {
    const updatedBlog = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    console.log(updatedBlog)
    const response = await blogService.update(blog.id, updatedBlog)
    return response.data
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      console.log(window.localStorage)

      blogService.setToken(user.token)
      setUser(user)
      setUserName('')
      setPassword('')
      setSuccesMessage(`${user.name} is logged`)
      setTimeout(() => setSuccesMessage(null), 3000)

    } catch { // unexpected eslint error
      setErrorMessage('Wrong username or password')
      setTimeout(() => setErrorMessage(null), 3000)
    }
  }

  const handleLogOut = () => {
    window.localStorage.clear()
    console.log(window.localStorage)
    setUser(null)
  }


  const loginForm = () => {
    return (
      <Togglable buttonLabel='login'>
        <LoginForm
          username={username}
          password={password}
          handleSubmit={handleLogin}
          handleUsernameChange={({ target }) => setUserName(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
        />
      </Togglable>
    )
  }

  const blogForm = () => (
    <Togglable buttonLabel='new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  /* equivalent à {user === null && loginForm()}
  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        {loginForm()}
      </div>
    )
  }
*/

  const sortedBlog = blogs.sort((a, b) => {
    return b.likes - a.likes
  })

  return (
    <div>
      <h1>blogs</h1>
      <Notification classMessage="error" message={errorMessage} />
      <Notification classMessage="succes" message={succesMessage} />

      {user === null ?
        <div>
          {loginForm()}
          {sortedBlog.map(blog =>
            <Blog
              key={blog.id}
              blog={blog}
              updateLike={() => updateLike(blog)}
            />
          )}
        </div>
        :
        <div>
          <p>
            {user.name} is logged in <button onClick={() => handleLogOut()}>Logout</button>
          </p>
          {blogForm()}
          {sortedBlog
            .filter(item => item.user.username === user.username)
            .map(blog =>
              <Blog
                key={blog.id}
                blog={blog}
                updateLike={() => updateLike(blog)}
                deleteButton={<button onClick={() => deleteRequest(blog)}>remove</button>}
              />
            )}
        </div>
      }
    </div>
  )
}

export default App
