const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, { 
    useNewUrlParser: true
}, (err) => {
    if(err)return console.log(err)
    console.log('Connected to MongoDB Atlas')
})