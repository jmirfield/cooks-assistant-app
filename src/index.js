const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')
const Recipe = require('./models/recipe')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.post('/users', async (req, res) => {
    const user = new User(req.body)
    try{
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(error)
    }
})

app.get('/users', async (req, res) => {
    try{
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        res.status(500).send(e)
    }
})

app.get('/users/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const user = await User.findById(_id)
        if(!user)return res.status(404).send()
        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

app.post('/recipes', async (req, res) => {
    const recipe = new Recipe(req.body)
    try {
        await recipe.save()
        res.status(201).send(recipe)
    } catch (e) {
        res.status(400).send(e)
    }
})

app.get('/recipes', async (req, res) => {
    try {
        const recipes = await Recipe.find({})
        res.send(recipes)
    } catch (e) {
        res.status(500).send(e)
    }
})

app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`)
})