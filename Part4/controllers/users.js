const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

userRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs')
  response.json(users)
})

userRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body
  console.log(password)
  const existingUser = await User.findOne({ username })
  console.log(existingUser)

  if (existingUser) {
    return response.status(400).json({ error: 'username must be unique' })
  }
  if (password.length < 3) {
    return response.status(400).json({ error: 'password must at least have three caracters'})
  }
  
  const saltRounds = 10 
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })
  
  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

module.exports = userRouter
