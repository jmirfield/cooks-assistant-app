const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../users/userModel')
const Recipe = require('../../recipes/recipeModel')

const testUserId1 = new mongoose.Types.ObjectId()
const testUserId2 = new mongoose.Types.ObjectId()
const testRecipeId1 = new mongoose.Types.ObjectId()

const testUser1 = {
    _id: testUserId1,
    username: 'test1',
    email: 'test1@test.com',
    password: 'test1pass',
    tokens: [{
        token: jwt.sign({_id: testUserId1}, process.env.JWT_SECRET)
    }]
}

const testUser2 = {
    _id: testUserId2,
    username: 'test2',
    email: 'test2@test.com',
    password: 'test2pass',
    tokens: [{
        token: jwt.sign({_id: testUserId2}, process.env.JWT_SECRET)
    }]
}

const testRecipe = {
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
    await new User(testUser1).save()
    await new User(testUser2).save()
    await new Recipe({
        ...testRecipe,
        _id: testRecipeId1,
        owner: testUserId1
    }).save()
}

module.exports = {
    testUserId1,
    testUser1,
    testUserId2,
    testUser2,
    testRecipe,
    testRecipeId1,
    setupDB
}