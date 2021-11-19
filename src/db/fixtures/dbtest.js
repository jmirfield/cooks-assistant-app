const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../users/userModel')
const Recipe = require('../../recipes/recipeModel')

const testUserId = new mongoose.Types.ObjectId()

const testUser = {
    _id: testUserId,
    username: 'test1',
    email: 'test1@test.com',
    password: 'test1pass',
    tokens: [{
        token: jwt.sign({_id: testUserId}, process.env.JWT_SECRET)
    }]
}

const testRecipe = {
    _id: testUserId,
    name: "Chili",
    ingredients: [
        {
            amount: 1,
            amountType: 'Tablespoon',
            ingredient: 'Salt'
        },
        {
            amount: 1,
            amountType: 'Pound',
            ingredient: 'Beans'
        }
    ],
    instructions: [
        {
            instruction: 'Step 1',
        },
        {
            instruction: 'Step 2',
        },
        {
            instruction: 'Step 3'
        }
    ],
    savedUrls: [
        {
            URL: "https://www.foodtecsolutions.com",
            description: 'Test'
        }
    ]
}

const setupDB = async() => {
    await User.deleteMany()
    await Recipe.deleteMany()
    await new User(testUser).save()
}

module.exports = {
    testUserId,
    testUser,
    testRecipe,
    setupDB
}