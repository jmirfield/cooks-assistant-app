const request = require('supertest')
const app = require('../app')
const User = require('./userModel')

const testUser = {
    username: 'test1',
    email: 'test1@test.com',
    password: 'test1pass'
}

beforeAll(async () => {
    await User.deleteMany()
    await new User(testUser).save()
})

test('Should signup a new user', async() => {
    await request(app).post('/users').send({
        'username': 'test2',
        'email': 'test2@test.com',
        'password': 'test2pass'
    }).expect(201)
})

test('Should FAIL because username already taken', async() => {
    await request(app).post('/users').send({
        'username': 'test1',
        'email': 'testfail1@test.com',
        'password': 'test1234'
    }).expect(400)
})

test('Should FAIL because email is already taken', async() => {
    await request(app).post('/users').send({
        'username': 'testfail2',
        'email': 'test1@test.com',
        'password': 'test1234'
    }).expect(400)
})


test('Should FAIL because password contains string: password', async() => {
    await request(app).post('/users').send({
        'username': 'testfail3',
        'email': 'test3@test.com',
        'password': 'password'
    }).expect(400)
})

test('Should FAIL because password is too short', async() => {
    await request(app).post('/users').send({
        'username': 'testfail4',
        'email': 'test4@test.com',
        'password': 'test11'
    }).expect(400)
})

test('Should FAIL because invalid email', async() => {
    await request(app).post('/users').send({
        'username': 'testfail5',
        'email': 'test5@test',
        'password': 'test5pass'
    }).expect(400)
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