const express = require('express')
require('./db/mongoose')
const userRouter = require('./users/userRouter')
const recipeRouter = require('./recipes/recipeRouter')

const app = express()
const PORT = process.env.PORT

app.use(express.json())

app.use(userRouter)
app.use(recipeRouter)


app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`)
})