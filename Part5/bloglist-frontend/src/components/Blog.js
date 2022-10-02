import { useState } from 'react'


const Blog = ({ blog, deleteButton, updateLike }) => {

  const [condition, setCondition] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleClick = () => {
    setCondition(!condition)
  }

  if (condition) {
    return (
      <div className='blog' style={blogStyle}>
        {blog.title} by {blog.author}<button onClick={handleClick}>hide</button><br/>
        {blog.url}<br/>
        {blog.likes}<button onClick={updateLike}>like</button><br/>
        {blog.user.username}<br/>
        {deleteButton}
      </div>
    )
  } else {
    return (
      <div className='blog' style={blogStyle}>
        {blog.title} by {blog.author}<button onClick={handleClick}>view</button>
      </div>
    )
  }
}

export default Blog