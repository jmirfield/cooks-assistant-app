const request = require('supertest')
const app = require('../app')
const Recipe = require('./recipeModel')
const { testRecipe, testUser, testUserId, setupDB } = require('../db/fixtures/dbtest.js')

jest.setTimeout(60000)

beforeEach(setupDB)

test('Should create a task for user', async () => {
    const response = await request(app)
        .post('/recipes')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send(testRecipe)
        .expect(201)
    const recipe = await Recipe.findById(testUserId)
    expect(recipe).toMatchObject(testRecipe)
})

test('Should FAIL to create a task for user because invalid URL', async () => {
    await request(app)
        .post('/recipes')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send({...testRecipe, savedUrls: [{URL:'www.test.'}]})
        .expect(400)
})

test('Should FAIL to create a task for user because no auth', async () => {
    await request(app)
        .post('/recipes')
        .send()
        .expect(401)
})