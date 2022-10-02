import { useState  } from 'react'

const BlogForm = ({ createBlog }) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleTitleChange = ({ target }) => setTitle(target.value)
  const handleAuthorChange = ({ target }) => setAuthor(target.value)
  const handleUrlChange = ({ target }) => setUrl(target.value)

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url,
      likes: 0,
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }
  return (
    <div>
      <h2>Add a new blog</h2>
      <form onSubmit={addBlog}>
        <label>Title :
          <input id='title' value={title} onChange={handleTitleChange} placeholder='Title' />
        </label><br/>
        <label>Author :
          <input id='author' value={author} onChange={handleAuthorChange} placeholder='Author' />
        </label><br/>
        <label>Url :
          <input id='url' value={url} onChange={handleUrlChange} placeholder='Url' />
        </label><br/>
        <button type="submit">add</button>
      </form>
    </div>
  )
}

export default BlogForm