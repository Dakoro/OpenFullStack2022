const blogsRouter = require('express').Router()
const { userExtrator, tokenExtractor} = require('../utils/middleware')
const Blog = require('../models/blog')
const User = require('../models/user')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })

  response.json(blogs)
})


blogsRouter.post('/', userExtrator, tokenExtractor, async (request, response) => {
  const body = request.body

  // eslint-disable-next-line no-undef
  const user = request.user

  if (!request.token || !user.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const currentUser = await User.findById(user.id)
  
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: currentUser._id
  })

  const savedBlog = await blog.save()
  currentUser.blogs = currentUser.blogs.concat(savedBlog._id)
  await currentUser.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtrator, tokenExtractor, async (request, response) => {
  // eslint-disable-next-line no-undef
  const user = request.user

  if (!request.token || !user.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = await Blog.findById(request.params.id)

  if (blog.user.toString() === user.id) {
    await Blog.findByIdAndRemove(request.params.id)
    return response.status(204).end()
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const updatedBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const result = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, {new: true})
  response.status(200).json(result)
})

module.exports = blogsRouter