const express = require('express')
const router = new express.Router()
const Recipe = require('../models/recipe')
const auth = require('../middleware/auth')

router.post('/recipes', auth, async (req, res) => {
    const recipe = new Recipe({
        ...req.body,
        owner: req.user._id
    })
    try {
        await recipe.save()
        res.status(201).send(recipe)
    } catch(e) {
        console.log(e)
        res.status(400).send(e)
    }
})

//GET /recipes?sortBy=updatedAt_asc
//GET /recipes?sortBy=updatedAt_desc
router.get('/recipes', auth, async (req, res) => {
    const sort = {}
    const options = { sort }
    if (req.query.limit) options.limit = parseInt(req.query.limit)
    if (req.query.skip) options.skip = parseInt(req.query.skip)
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split("_")
        options.sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try {
        await req.user.populate({
            path: 'recipes',
            options
        })
        res.send(req.user.recipes)
    } catch(e) {
        res.status(500).send(e)
    }
})

router.get('/recipes/:id', auth, async (req, res) => {
    try {
        const recipe = await Recipe.findOne({_id: req.params.id, owner: req.user._id})
        if(!recipe)return res.status(404).send()
        res.send(recipe)
    } catch(e) {
        res.status(500).send(e)
    }
})

router.patch('/recipes/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['ingredients', 'instructions', 'savedUrls', 'name']
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
    if(!isValidUpdate)return res.status(400).send({'error': 'Invalid updates!'})
    try {
        const recipe = await Recipe.findOne({_id: req.params.id, owner: req.user._id})
        if(!recipe)return res.status(404).send()
        updates.forEach((update) => recipe[update] = req.body[update])
        await recipe.save()
        res.send(recipe)
    } catch(e) {
        res.status(500).send(e)
    }
})

router.delete('/recipes/:id', auth, async (req, res) => {
    try {
        const recipe = await Recipe.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if(!recipe)return res.status(404).send()
        res.send(recipe)
    } catch(e) {
        res.status(500).send(e)
    }
})

module.exports = router