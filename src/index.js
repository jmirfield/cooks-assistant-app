const express = require('express')
require('./db/mongoose')
const userRouter = require('./routes/user')
const recipeRouter = require('./routes/recipe')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.use(userRouter)
app.use(recipeRouter)


app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`)
})