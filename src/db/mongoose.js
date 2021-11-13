const mongoose = require('mongoose')

const CONNECTION_URL = 'mongodb://127.0.0.1:27017/'
const DATABASE_NAME = 'task-manager-api'

mongoose.connect(CONNECTION_URL + DATABASE_NAME, { 
    useNewUrlParser: true
}, (err) => {
    if(err)console.log(err)
})