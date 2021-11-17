const express = require('express')
require('./db/mongoose')
const userRouter = require('./users/userRouter')
const recipeRouter = require('./recipes/recipeRouter')

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(recipeRouter)

module.exports = app