const mongoose = require('mongoose')
const validator = require('validator')

const CONNECTION_URL = 'mongodb://127.0.0.1:27017/'
const DATABASE_NAME = 'task-manager-api'

mongoose.connect(CONNECTION_URL + DATABASE_NAME, { 
    useNewUrlParser: true
}, (err) => {
    if(err)throw err
})

const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        validate(val) {
            if(val < 0) throw new Error('Age must be > 0')
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(val) {
            if(!validator.isEmail(val))throw new Error(`Input: "${val}" is not a valid email`)
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
    }
})


// Testing User model and saving to DB
const test = new User({
    name: 'Justin',
    age: 24,
    email: "justiN@test.com",
    password: "test1234"
})

test.save().then(() => {
    console.log(test)
}).catch((error) => {
    console.log(error)
})
