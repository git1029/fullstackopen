require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
// const cors = require('cors')
const app = express()
const Person = require('./models/person')

// Use static build files
app.use(express.static('build'))

// json-parser to implement POST requests
app.use(express.json())

// // Allow cross-origin resource sharing
// app.use(cors())

// app.use(morgan('tiny'))
morgan.token('body', (request) => {
  return request.method === 'POST'
    ? JSON.stringify(request.body)
    : ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/', (_request, response) => {
  response.send('Hello world')
})

app.get('/info', (_request, response) => {
  Person
    .countDocuments({})
    .then(count => {
      response.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${new Date()}</p>
      `)
    })
})

app.get('/api/persons', (_request, response) => {
  Person
    .find({})
    .then(persons => {
      response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person
    .findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person
    .findByIdAndRemove(request.params.id)
    .then(result => {
      if (result) {
        response.status(204).end()
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person
    .save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  const options = {
    runValidators: true,
    context: 'query',
    new: true
  }

  Person
    .findByIdAndUpdate(request.params.id, person, options)
    .then(updatedPerson => {
      if (updatedPerson) {
        response.json(updatedPerson)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// handler of requests with unknown endpoint
const unknownEndpoint = (_request, response) => {
  response.status(404).send({ error: 'unkown endpoint' })
}

app.use(unknownEndpoint)

// handler of requests which result to errors
const errorHandler = (error, _request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

// eslint-disable-next-line no-undef
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})