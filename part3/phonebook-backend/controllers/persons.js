const personsRouter = require('express').Router()
const Person = require('../models/person')

// get all persons
personsRouter.get('/', (req, res, next) => {
  Person.find({})
    .then(persons => {
      res.json(persons)
    })
    .catch(error => next(error))
})

// get single person
personsRouter.get('/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if(person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

// delete a person
personsRouter.delete('/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

// make a post request
personsRouter.post('/', (req, res, next) => {
  const body = req.body

  if (!body.phone || !body.name) {
    return res.status(400).json({
      error: 'content warning: name or phone is missing'
    })
  }

  const person = new Person({
    name: body.name,
    phone: body.phone,
  })

  person.save()
    .then(savedPerson => {
      res.json(savedPerson)
    })
    .catch(error => next(error))
})

// update person details
personsRouter.put('/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    phone: body.phone
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

module.exports = personsRouter