const config = require('./utils/config')
const express = require('express') // import express using commonjs syntax
const app = express() // create an instance of express
const cors = require('cors') // cross origin resource sharing
const personsRouter = require('./controllers/persons')
const infoRouter = require('./controllers/info')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose') // import mongoose using commonjs syntax

mongoose.set('strictQuery', false) // When the strict option is set to true, Mongoose will ensure that only the fields that are specified in your schema will be saved in the database, and all other fields will not be saved (if some other fields are sent).

// try connecting to url, print appropriate message
mongoose.connect(config.MONGODB_URL)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch(error => {
    logger.error('error connecting to MongoDB', error.message)
  })

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.morgan)

app.use('/api/persons', personsRouter)
app.use('/api/', infoRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app