const express = require('express')
const router = new express.Router()
const recipeController = require('./recipeController')
const auth = require('../middleware/auth')

router.post('/recipes', auth, recipeController.createNewRecipe)
//GET /recipes?sortBy=updatedAt_asc || GET /recipes?sortBy=updatedAt_desc
router.get('/recipes', auth, recipeController.getRecipes)
router.get('/recipes/:id', auth, recipeController.getRecipeById)
router.patch('/recipes/:id', auth, recipeController.updateRecipeById)
router.delete('/recipes/:id', auth, recipeController.deleteRecipeById)

module.exports = router