require('dotenv').config() // make sure node is able to environment variables created in .env file by dotenv lib
const express = require('express') // import express using commonjs syntax
const app = express() // create an instance of express
let morgan = require('morgan') // import morgan using commonjs syntax, u first also need to install morgan via npm
const Person = require('./models/person') // import our model and store it in Person constructor

// morgon is a request logger and it has many configurations, we're using tiny
// we can also create new tokens that we can log during our request logging in the console
// here we are logging request body in the console, just for checking purpose, altho it is v uncommon and might as well be considered a privacy nightmare
morgan.token('body', (req,res) => {
    return JSON.stringify(req.body) // need to return the token as string otherwise it'll pring [Object object]
})

const now = new Date() // used to print in info 

app.use(express.json()) // use json parser to send requests
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body')) // create the format of the resource logging to use
app.use(express.static('dist')) // used to serve dist folder as the starting point of the app

// this one is a middleware that runs when api request is made on a address that has nothing
const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

// persons object, make sure to use let instead of const otherwise you won't be able to make delete or post requets
let persons = []

// get all persons
app.get('/api/persons', (req, res, next) => {
    Person.find({})
        .then(persons => {
            res.json(persons)
        })
        .catch(error => next(error))
})

// get info of the phone book
app.get('/info', (req, res, next) => {
    Person.find({})
        .then(persons => {
            res.send(`Phonebook has info for ${persons.length} people <br /><br />${now}`)
        })
        .catch(error => next(error))
})

// get single person 
app.get('/api/persons/:id', (req, res, next) => {
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
app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

// make a post request
app.post('/api/persons', (req, res, next) => {
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
app.put('/api/persons/:id', (req, res, next) => {
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

// make sure of the order of the middleware that you use, runs from top to bottom
app.use(unknownEndpoint)

// create another middleware for error handling
const errorHandler = (error, req, res, next) => {
    console.error(error.message)

    if(error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    } else if(error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
    }

    next(error)
}

// error handler middleware always comes last
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})