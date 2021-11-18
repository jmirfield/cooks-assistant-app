const express = require('express')
const router = new express.Router()
const userController = require('./userController')
const auth = require('../middleware/auth')

router.post('/users', userController.createNewUser)
router.post('/users/login', userController.login)
router.post('/users/logout', auth, userController.logout)
router.post('/users/logoutAll', auth, userController.logoutAll)
router.get('/users/me', auth, userController.getCurrentUser)
router.patch('/users/me', auth, userController.updateCurrentUser)
router.delete('/users/me', auth, userController.deleteCurrentUser)

module.exports = router