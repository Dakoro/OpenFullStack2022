const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const api = supertest(app)

describe('tests on blogs', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('shalashaska', 10)
    const user = new User({ username: 'Adam', name: 'Ocelot', passwordHash })
    await user.save()
    await Blog.deleteMany({})
    console.log('cleared')
    await Blog.insertMany(helper.initialsBlogs)
    console.log('done')
  })

  test('notes are returned as json', async () => {
    await api 
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('a correct id is returned', async () => {
    const response = await api.get('/api/blogs')
    for (let i = 0; i < response.body.length; i += 1) {
      expect(response.body[i].id).toBeDefined()
    }
  })

  test('a new blog has been added whith a correct token', async () => {
    
    const login = {
      username: 'Adam',
      password: 'shalashaska'
    }

    const response = await api 
      .post('/api/login')
      .send(login)
    
    const token = response.body.token
    console.log(token)
    const user = await User.findOne({username: 'Adam' })
    console.log(user)
    const id = user.id
    console.log(id)

    const blog = {
      title: 'test',
      author: 'John',
      url: 'https://fskdlhfsh',
      likes: 50,
      user: id,
    }

    await api
      .post('/api/blogs')
      .set({ Authorization: `bearer ${token}` })
      .send(blog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const lastBlog = await helper.blogsInDb()
    expect(lastBlog).toHaveLength(helper.initialsBlogs.length + 1)
    const author = lastBlog.map(item => item.author)
    expect(author).toContain('John')
  })

  test('creating a new blog with the wrong token', async () => {
    const token = 'hfsklhfi54649'

    const blog = {
      title: 'test',
      author: 'John',
      url: 'https://fskdlhfsh',
      likes: 50
    }

    const response = await api
      .post('/api/blogs')
      .set({ Authorization: `bearer ${token}` })
      .send(blog)
      .expect(401)
      .expect('Content-Type', /application\/json/)
    
    const lastBlog = await helper.blogsInDb()
    expect(lastBlog).toHaveLength(helper.initialsBlogs.length)
    expect(response.body.error).toContain('invalid token')
  })

  test('the "likes" property is missing', async () => {
    const response = await api.get('/api/blogs')
    for (let i = 0; i < response.body.length; i += 1) {
      if (!expect(response.body[i].id).toBeDefined()) {
        response.body[i].id = 0
      }
    }
  })

  test('check the "title" and "url" properties of a new blog', async () => {
    const login = {
      username: 'Adam',
      password: 'shalashaska'
    }

    const response = await api 
      .post('/api/login')
      .send(login)
    
    const token = response.body.token
    console.log(token)

    const blog = {
      author: 'Adam',
      url: 'https://gshlmjflksf',
    }

    await api
      .post('/api/blogs')
      .set({ Authorization: `bearer ${token}` })
      .send(blog)
      .expect(400)

    const blogAtEnd = await helper.blogsInDb()
    expect(blogAtEnd).toHaveLength(helper.initialsBlogs.length)
  })

  test('a blog has been modified', async () => {
    const blogs = await helper.blogsInDb()
    const id = blogs[0].id
    const updatedBlog = {
      author: 'Adamska',
      likes: 4,
      title: 'Icarus',
      url: 'https://stackoverflow.com/questions/2342579/http-status-code-for-update-and-delete',
    }
    
    const response = await api 
      .put(`/api/blogs/${id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    console.log(response.body)
    const blogsAtEnd = await helper.blogsInDb()
    const result = blogsAtEnd[0]
    console.log(result)
    expect(response.body).toEqual(result)
    
    expect(blogsAtEnd).toHaveLength(helper.initialsBlogs.length)
  })

  test('a blog has been deleted', async () => {
    const login = {
      username: 'Adam',
      password: 'shalashaska'
    }

    const response = await api 
      .post('/api/login')
      .send(login)
    
    const token = response.body.token
    console.log(token)
    const user = await User.findOne({username: 'Adam' })
    console.log(user)
    const id = user.id
    console.log(id)

    const blog = {
      title: 'test',
      author: 'John',
      url: 'https://fskdlhfsh',
      likes: 50,
      user: id,
    }

    console.log(blog)

    await api
      .post('/api/blogs')
      .set({ Authorization: `bearer ${token}` })
      .send(blog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const blogToDelete = await Blog.findOne({user: id})
    console.log(blogToDelete)
    await api 
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set({Authorization: `bearer ${token}`})
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialsBlogs.length)
  })
})

describe('test for users', () => {
  beforeEach(async() => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('shalashaska', 10)
    const user = new User({ username: 'Adam', name: 'Ocelot', passwordHash })
    await user.save()
  })

  test('get all users stored in the database', async() => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    const userAtEnd = await helper.usersInDb()
    console.log(userAtEnd)
    expect(userAtEnd).toHaveLength(1)
  })

  test('create a new user', async() => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Dakoro',
      name: 'David',
      password: 'fdiqld22'
    }
    await api 
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(element => element.username)
    expect(usernames).toContain(newUser.username)
  })

  test('user invalid if username is already taken', async() => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Adam',
      name: 'hiroku',
      password: '156464'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)

    expect(response.body.error).toContain('username must be unique')
    
  })
})

describe('test on login', () => {
  test('test on a succesful login', async () => {

    const login = {
      username: 'Adam',
      password: 'shalashaska'
    }

    await api 
      .post('/api/login')
      .send(login)
      .expect(200)
    
  })
})


afterAll(() => {
  mongoose.connection.close()
  console.log('connection to MongoDB closed')
})