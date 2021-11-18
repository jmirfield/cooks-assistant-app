const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../app')
const User = require('./userModel')

const testUserId = new mongoose.Types.ObjectId()

const testUser = {
    username: 'test1',
    email: 'test1@test.com',
    password: 'test1pass',
    _id: testUserId,
    tokens: [{
        token: jwt.sign({_id: testUserId}, process.env.JWT_SECRET)
    }]
}

beforeEach(async () => {
    await User.deleteMany()
    await new User(testUser).save()
})

test('Should signup a new user', async() => {
    await request(app).post('/users')
        .send({
            'username': 'test2',
            'email': 'test2@test.com',
            'password': 'test2pass'
        })
        .expect(201)
})

test('Should FAIL signup because username already taken', async() => {
    await request(app).post('/users')
        .send({
            'username': 'test1',
            'email': 'testfail1@test.com',
            'password': 'test1234'
        })
        .expect(400)
})

test('Should FAIL signup because email is already taken', async() => {
    await request(app).post('/users')
        .send({
            'username': 'testfail2',
            'email': 'test1@test.com',
            'password': 'test1234'
        })
        .expect(400)
})


test('Should FAIL signup because password contains string: \'password\'', async() => {
    await request(app).post('/users')
        .send({
            'username': 'testfail3',
            'email': 'test3@test.com',
            'password': 'password'
        })
        .expect(400)
})

test('Should FAIL signup because password is too short', async() => {
    await request(app).post('/users')
        .send({
            'username': 'testfail4',
            'email': 'test4@test.com',
            'password': 'test11'
        })
        .expect(400)
})

test('Should FAIL signup because invalid email format', async() => {
    await request(app).post('/users')
        .send({
            'username': 'testfail5',
            'email': 'test5@test',
            'password': 'test5pass'
        })
        .expect(400)
})

test('Should Fail login since non-existing user', async() => {
    await request(app).post('/users/login')
        .send({
            'email': 'none@test.com',
            'password': 'testfail6'
        })
        .expect(400)
})

test('Should Fail login since wrong password for test user', async() => {
    await request(app).post('/users/login')
        .send({
            'email': testUser.email,
            'password': 'testfail7'
        })
        .expect(400)
})

test('Should login existing test user', async() => {
    await request(app).post('/users/login')
        .send({
            'email': testUser.email,
            'password': testUser.password
        })
        .expect(200)
})

test('Should logout current user', async() => {
    await request(app)
        .post('/users/logout')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should FAIL logout since incorrect token', async() => {
    await request(app)
        .post('/users/logout')
        .set('Authorization', `Bearer testtoken123456`)
        .send()
        .expect(401)
})

test('Should logout all tokens for current user', async() => {
    await request(app)
        .post('/users/logoutAll')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should FAIL logging out all tokens for current user', async() => {
    await request(app)
        .post('/users/logoutAll')
        .set('Authorization', `Bearer testtoken123456`)
        .send()
        .expect(401)
})

test('Should read current user profile', async() => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should FAIL to read current user profile since incorrect token', async() => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer testtoken123456`)
        .send()
        .expect(401)
})

test('Should update current user profile', async() => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send({
            username: 'newtestuser'
        })
        .expect(200)
})

test('Should FAIL to update current user profile since incorrect token', async() => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer testtoken123456`)
        .send({
            username: 'newtestuser'
        })
        .expect(401)
})

test('Should FAIL to update current user profile since tokens cannot be modified through patch method', async() => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send({
            tokens: []
        })
        .expect(400)
})

test('Should delete current user', async() => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should FAIL to delete current user since incorrect token', async() => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer testtoken123456`)
        .send()
        .expect(401)
})