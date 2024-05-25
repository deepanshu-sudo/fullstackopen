const mongoose = require('mongoose') // import mongoose using commonjs syntax

mongoose.set('strictQuery',false) // When the strict option is set to true, Mongoose will ensure that only the fields that are specified in your schema will be saved in the database, and all other fields will not be saved (if some other fields are sent).

const url = process.env.MONGODB_URL // import mongodb url from environment variables set by dotenv

console.log('connecting to',url)

// try connecting to url, print appropriate message
mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB', error.message)
    })

// create the person schema, the way in which the mongodb database collection will store the appropriate object in the document
const personSchema = new mongoose.Schema({
    name: String,
    phone: String,
})

// transform the schema to remove un-needed fields and convert the id into a string (which is set to an object by default in mongodb)
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

// export module using commonjs syntax
module.exports = mongoose.model('Person', personSchema)