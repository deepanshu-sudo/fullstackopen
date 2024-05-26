let morgan = require('morgan') // import morgan using commonjs syntax, u first also need to install morgan via npm

// morgon is a request logger and it has many configurations, we're using tiny
// we can also create new tokens that we can log during our request logging in the console
// here we are logging request body in the console, just for checking purpose, altho it is v uncommon and might as well be considered a privacy nightmare
morgan.token('body', (req) => {
  return JSON.stringify(req.body) // need to return the token as string otherwise it'll pring [Object object]
})

// this one is a middleware that runs when api request is made on a address that has nothing
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

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

module.exports = {
  morgan: morgan(':method :url :status :res[content-length] - :response-time ms :body'),
  unknownEndpoint,
  errorHandler
}