const { MongoClient, ObjectId } = require('mongodb')

//Localhost URL
const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

// const id = new ObjectId()
// console.log(id.getTimestamp())

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if(error) return console.log('Unable to connect to DB') 
    console.log('Connected to MongoDB')

    const db = client.db(databaseName)

    // db.collection('users').insertOne( {
    //     name: 'test',
    //     age: 0
    // }, (error, result) => {
    //     if(error)return console.log('error')
    //     console.log(result.ops)
    // })

    db.collection('users').find({}).toArray(function(err, result) {
        if (err) throw err
        console.log(result)
    })

})