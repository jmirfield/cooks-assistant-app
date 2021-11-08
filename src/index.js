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
    try {
        await user.save()
        res.status(201).send(user)
    } catch(e) {
        res.status(400).send(e)
    }
})

app.get('/users', async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch(e) {
        res.status(500).send(e)
    }
})

app.get('/users/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const user = await User.findById(_id)
        if(!user)return res.status(404).send()
        res.send(user)
    } catch(e) {
        res.status(500).send(e)
    }
})

app.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['username', 'email', 'password']
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
    if(!isValidUpdate)return res.status(400).send({'error': 'Invalid updates!'})
    const _id = req.params.id
    try {
        const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true})
        if(!user)return res.status(404).send()
        res.send(user)
    } catch(e) {
        res.status(500).send(e)
    }
})

app.post('/recipes', async (req, res) => {
    const recipe = new Recipe(req.body)
    try {
        await recipe.save()
        res.status(201).send(recipe)
    } catch(e) {
        res.status(400).send(e)
    }
})

app.get('/recipes', async (req, res) => {
    try {
        const recipes = await Recipe.find({})
        res.send(recipes)
    } catch(e) {
        res.status(500).send(e)
    }
})

app.get('/recipes/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const recipe = await Recipe.findById(_id)
        if(!recipe)return res.status(404).send()
        res.send(recipe)
    } catch(e) {
        res.status(500).send(e)
    }
})

app.patch('/recipes/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['ingredients', 'instructions', 'savedUrls']
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
    if(!isValidUpdate)return res.status(400).send({'error': 'Invalid updates!'})
    const _id = req.params.id
    try {
        const recipe = await Recipe.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true})
        if(!recipe)return res.status(404).send()
        res.send(recipe)
    } catch(e) {
        res.status(500).send(e)
    }
})

app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`)
})