const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, { 
    useNewUrlParser: true
}, (err) => {
    if(err)console.log(err)
})