const mongoose = require('mongoose') // import mongoose using commonjs syntax

// create the person schema, the way in which the mongodb database collection will store the appropriate object in the document
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  phone: {
    type: String,
    validate: {
      validator: (v) => {
        const regex = /^\d{2,3}-\d+$/
        return regex.test(v) && v.length >= 8
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
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