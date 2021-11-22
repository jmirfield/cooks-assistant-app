const request = require('supertest')
const app = require('../app')
const Recipe = require('./recipeModel')
const { testRecipe, testRecipeId1, testUser1, testUser2, setupDB } = require('../db/fixtures/dbtest.js')

jest.setTimeout(60000)

beforeEach(setupDB)

test('Should create a task for user', async () => {
    const response = await request(app)
        .post('/recipes')
        .set('Authorization', `Bearer ${testUser1.tokens[0].token}`)
        .send(testRecipe)
        .expect(201)
    const recipe = await Recipe.findById(response.body._id)
    expect(recipe).toMatchObject(testRecipe)
})

test('Should FAIL to create a task for user because invalid URL', async () => {
    await request(app)
        .post('/recipes')
        .set('Authorization', `Bearer ${testUser1.tokens[0].token}`)
        .send({...testRecipe, savedUrls: [{URL:'www.test.'}]})
        .expect(400)
})

test('Should FAIL to create a task for user because no auth', async () => {
    await request(app)
        .post('/recipes')
        .send()
        .expect(401)
})

test('Should get all task for user', async () => {
    await request(app)
        .get('/recipes')
        .set('Authorization', `Bearer ${testUser1.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should FAIL to get all tasks for user because no auth', async () => {
    await request(app)
        .get('/recipes')
        .set('Authorization', `Bearer badtoken`)
        .send()
        .expect(401)
})

test('Should get task by id for user', async () => {
    await request(app)
        .get(`/recipes/${testRecipeId1}`)
        .set('Authorization', `Bearer ${testUser1.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should FAIL to get task by id since user is not owner', async () => {
    await request(app)
        .get(`/recipes/${testRecipeId1}`)
        .set('Authorization', `Bearer ${testUser2.tokens[0].token}`)
        .send()
        .expect(404)
})

test('Should update task by id for user', async () => {
    const response = await request(app)
        .patch(`/recipes/${testRecipeId1}`)
        .set('Authorization', `Bearer ${testUser1.tokens[0].token}`)
        .send({
            ingredients: []
        })
        .expect(200)
    const recipe = await Recipe.findById(testRecipeId1)
    expect(recipe.ingredients.length).toEqual(0)
})

test('Should FAIL to update task by id since user is not owner', async () => {
    const response = await request(app)
        .patch(`/recipes/${testRecipeId1}`)
        .set('Authorization', `Bearer ${testUser2.tokens[0].token}`)
        .send({
            ingredients: []
        })
        .expect(404)
})