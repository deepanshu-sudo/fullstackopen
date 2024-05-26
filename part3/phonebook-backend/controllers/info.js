const infoRouter = require('express').Router()
const Person = require('../models/person')

// get info of the phone book
infoRouter.get('/info', (req, res, next) => {
  const now = new Date() // used to print in info
  Person.find({})
    .then(persons => {
      res.send(`Phonebook has info for ${persons.length} people <br /><br />${now}`)
    })
    .catch(error => next(error))
})

module.exports = infoRouter