const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')
const Recipe = require('./models/recipe')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.post('/users', (req, res) => {
    const user = new User(req.body)
    user.save().then(() => {
        res.status(201).send(user)
    }).catch((error) => {
        res.status(400).send(error)
    })
})

app.get('/users', (req, res) => {
    User.find({}).then((users) => {
        res.send(users)
    }).catch((err) => {
        res.status(500).send(err)
    })
})

app.get('/users/:id', (req, res) => {
    const _id = req.params.id
    User.findById(_id).then((user) => {
        if(!user)return res.status(404).send()
        res.send(user)
    }).catch((err) => {
        res.status(500).send(err)
    })
})

app.post('/tasks', (req, res) => {
    const task = new Task(req.body)
    task.save().then(() => {
        res.status(201).send(task)
    }).catch((error) => {
        res.status(400).send(error)
    })
})

app.get('/tasks', (req, res) => {
    Task.find({}).then((tasks) => {
        res.send(tasks)
    }).catch((err) => {
        res.status(500).send(err)
    })
})

app.get('/tasks/:id', (req, res) => {
    const _id = req.params.id
    Task.findById(_id).then((task) => {
        if(!task)return res.status(404).send()
        res.send(task)
    }).catch((err) => {
        res.status(500).send(err)
    })
})

app.post('/recipes', (req, res) => {
    const recipe = new Recipe(req.body)
    recipe.save().then(() => {
        res.status(201).send(recipe)
    }).catch((error) => {
        res.status(400).send(error)
    })
})

app.get('/recipes', (req, res) => {
    Recipe.find({}).then((recipes) => {
        res.send(recipes)
    }).catch((err) => {
        res.status(500).send(err)
    })
})

app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`)
})