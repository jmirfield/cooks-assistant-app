const express = require('express')
const router = new express.Router()
const Recipe = require('../models/recipe')

router.post('/recipes', async (req, res) => {
    const recipe = new Recipe(req.body)
    try {
        await recipe.save()
        res.status(201).send(recipe)
    } catch(e) {
        console.log(e)
        res.status(400).send(e)
    }
})

router.get('/recipes', async (req, res) => {
    try {
        const recipes = await Recipe.find({})
        res.send(recipes)
    } catch(e) {
        res.status(500).send(e)
    }
})

router.get('/recipes/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const recipe = await Recipe.findById(_id)
        if(!recipe)return res.status(404).send()
        res.send(recipe)
    } catch(e) {
        res.status(500).send(e)
    }
})

router.patch('/recipes/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['ingredients', 'instructions', 'savedUrls']
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
    if(!isValidUpdate)return res.status(400).send({'error': 'Invalid updates!'})
    const _id = req.params.id
    try {
        const recipe = await Recipe.findById(_id)
        if(!recipe)return res.status(404).send()
        updates.forEach((update) => recipe[update] = req.body[update])
        await recipe.save()
        res.send(recipe)
    } catch(e) {
        res.status(500).send(e)
    }
})

router.delete('/recipes/:id', async (req, res) => {
    const _id = req.params.id
    try{
        const recipe = await Recipe.findByIdAndDelete(_id)
        if(!recipe)return res.status(404).send()
        res.send(recipe)
    } catch(e) {
        res.status(500).send(e)
    }
})

module.exports = router