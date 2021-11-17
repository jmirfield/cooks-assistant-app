const request = require('supertest')
const app = require('../app')
const User = require('./userModel')

const testUser = {
    username: 'test123',
    email: 'test123@test.com',
    password: 'test1234'
}

beforeEach(async () => {
    await User.deleteMany()
    await new User(testUser).save()
})

test('Should signup a new user', async() => {
    await request(app).post('/users').send({
        'username': 'testuser123',
        'email': 'test@test.com',
        'password': 'test1234'
    }).expect(201)
})

test('Should login existing test user', async() => {
    await request(app).post('/users/login').send({
        'email': testUser.email,
        'password': testUser.password
    }).expect(200)
})

test('Should fail login since non-existing user', async() => {
    await request(app).post('/users/login').send({
        'email': 'none@test.com',
        'password': 'doesnotexist'
    }).expect(400)
})

test('Should fail login since wrong password for test user', async() => {
    await request(app).post('/users/login').send({
        'email': testUser.email,
        'password': 'doesnotexist'
    }).expect(400)
})