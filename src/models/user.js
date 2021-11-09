const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
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

UserSchema.methods.generateAuthToken = async function() {
    const token = jwt.sign({_id: this._id.toString()}, 'thisisatestsecrettoken')
    this.tokens = this.tokens.concat({ token })
    this.save()
    return token
}

//Checks for login
UserSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if(!user)throw new Error('Unable to login')
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch)throw new Error('Unable to login')
    return user
}

//Hash passwords
UserSchema.pre('save', async function (next) {
    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }
    next()
})

const User = mongoose.model('User', UserSchema)

module.exports = User