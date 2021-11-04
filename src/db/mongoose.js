const mongoose = require('mongoose')

const CONNECTION_URL = 'mongodb://127.0.0.1:27017/'
const DATABASE_NAME = 'task-manager-api'

mongoose.connect(CONNECTION_URL + DATABASE_NAME, { 
    useNewUrlParser: true
}, (err) => {
    if(err)throw err
})





// Testing User model and saving to DB
// const test = new Task({
//     description: "Test test test"
// })

// test.save().then(() => {
//     console.log(test)
// }).catch((error) => {
//     console.log(error)
// })
