const mongoose = require('mongoose')
const { Schema } = mongoose
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Recipe = require('./recipe')

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(val) {
            if(!validator.isEmail(val))throw new Error(`"${val}" is not a valid email`)
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(val) {
            if(val.length < 6) throw new Error("Passsword needs to be at least 7 characters")
            if(val.toLowerCase().includes("password"))throw new Error("Password cannot contain 'password'")
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

UserSchema.virtual('recipes', {
    ref: 'Recipe',
    localField: '_id',
    foreignField: 'owner'
})

//Generates login JWT token
UserSchema.methods.generateAuthToken = async function() {
    const token = jwt.sign({_id: this._id.toString()}, 'thisisatestsecrettoken')
    this.tokens = this.tokens.concat({ token })
    return token
}

//Setting up public profile
UserSchema.methods.toJSON = function() {
    const userObj = this.toObject()
    delete userObj.password
    delete userObj.tokens
    return userObj
}

//Checks for login using email and password
UserSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if(!user)throw new Error('Unable to login')
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch)throw new Error('Unable to login')
    return user
}

//Hashes passwords prior to saving to DB using Jcrypt
UserSchema.pre('save', async function (next) {
    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }
    next()
})

//Deletes all recipes if User is removed
UserSchema.pre('remove', async function (next) {
    await Recipe.deleteMany({ owner: this._id })
    next()
})

const User = mongoose.model('User', UserSchema)

module.exports = User