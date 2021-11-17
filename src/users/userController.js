const User = require('./userModel')

class UserController {

    createNewUser = async (req, res) => {
        const user = new User(req.body)
        try {
            const token = await user.generateAuthToken()
            await user.save()
            res.status(201).send({ user, token })  
        } catch(e) {
            res.status(400).send()
        }
    }

    login = async (req, res) => {
        try {
            const user = await User.findByCredentials(req.body.email, req.body.password)
            const token = await user.generateAuthToken() 
            await user.save()
            res.send({ user, token })
        } catch(e) {
            res.status(400).send()
        }
    }

    logout = async (req, res) => {
        try {
            req.user.tokens = req.user.tokens.filter((token) => req.token !== token.token)
            await req.user.save()
            res.send()
        } catch(e) {
            res.status(500).send()
        }
    }

    logoutAll = async (req, res) => {
        try {
            req.user.tokens = []
            await req.user.save()
            res.send()
        } catch(e) {
            res.status(500).send()
        }
    }

    getCurrentUser = async (req, res) => {
        res.send(req.user)
    }

    updateCurrentUser = async (req, res) => {
        const updates = Object.keys(req.body)
        const allowedUpdates = ['username', 'email', 'password']
        const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
        if(!isValidUpdate)return res.status(400).send({'error': 'Invalid updates!'})
        try {
            updates.forEach((update) => req.user[update] = req.body[update])
            await req.user.save()
            res.send(req.user)
        } catch(e) {
            res.status(500).send(e)
        }
    }

    deleteCurrentUser = async (req, res) => {
        try{
            await req.user.deleteOne()
            res.send(req.user)
        } catch(e) {
            res.status(500).send(e)
        }
    }
}


module.exports = new UserController()