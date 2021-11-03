const { MongoClient, ObjectId } = require('mongodb')

//Localhost URL
const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

// const id = new ObjectId()
// console.log(id.getTimestamp())

// Connecting to MongoDB locally
MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if(error) return console.log('Unable to connect to DB') 
    console.log('Connected to MongoDB')

    const db = client.db(databaseName)

    // *** Inserting single document with custom fields
    // db.collection('users').insertOne( {
    //     name: 'test',
    //     age: 0
    // }, (error, result) => {
    //     if(error)return console.log('error')
    //     console.log(result.ops)
    // })

    // *** Deleting single document by ObjectId
    // db.collection('users').deleteOne({_id: ObjectId('6181988200bf36064d96f1cb')}, (error, result) => {
    //     if(error)return console.log('Error with deleting documents')
    //     console.log(result.deletedCount)
    // })
    
    // Retuns all documents in 'users' collection
    db.collection('users').find({}).toArray(function(err, result) {
        if (err) throw err
        console.log(result)
    })
    

})