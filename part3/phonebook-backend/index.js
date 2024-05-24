const express = require('express') // import express using commonjs syntax
const app = express() // create an instance of express
let morgan = require('morgan') // import morgan using commonjs syntax, u first also need to install morgan via npm

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

// create a function that generates id's
const generateId = () => {
    return Math.floor(Math.random() * 99999)
}

// persons object, make sure to use let instead of const otherwise you won't be able to make delete or post requets
let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "phone": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "phone": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "phone": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "phone": "39-23-6423122"
    }
]

// testing 
app.get('/', (req, res) => {
    res.send('hello world')
})

// get all persons
app.get('/api/persons', (req, res) => {
    res.json(persons)
})

// get info of the phone book
app.get('/info', (req, res) => {
    res.send(
        `
        Phonebook has info for ${persons.length} people <br /><br />
        ${now}
        `
    )
})

// get single person 
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

// delete a person
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

// make a post request
app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.phone || !body.name) {
        return res.status(400).json({
            error: 'content warning: name or phone is missing'
        })
    }

    const nameExists = persons.find(person => person.name.toLowerCase() === body.name.toLowerCase())

    if (nameExists) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        phone: body.phone
    }

    persons = persons.concat(person)
    res.json(person)
})

// make sure of the order of the middleware that you use, runs from top to bottom
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})