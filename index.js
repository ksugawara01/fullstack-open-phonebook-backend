require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./models/person')
const { findByIdAndUpdate } = require('./models/person')
const app = express()

app.use(express.static('build'))
app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())

//Error handler middleware
const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    }
    
    next(error)
}
//This must be the last loaded middleware
app.use(errorHandler)  


app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })

app.get('/info', (request, response) => {
    console.log(Person.count())
    response.send(`Phonebook has info for ${Person.count({}).then((count) => count)} people
    <br/>${new Date()}`)
    
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then((person) => {
        response.json(person)
    })
})

app.get('/api/persons/:id', (request, response, next) => {

    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {

    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response) => {
    const person = {
        name: request.body.name,
        number: request.body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
    console.log("request body", request.body)
    
    const person = new Person({
        name: request.body.name,
        number: request.body.number,
    })

    person.save().then((result) => {
        console.log(`${person.name} has been saved to the database.`)
        return response.json(person) 
    })
/*
    if(person.name && person.number) {
        if (persons.some(p => p.name === person.name)) {
            return response.status(400).json({
                error: `${person.name} is already in the phonebook`
            })
        } else {
            persons = persons.concat(person)
            response.json(person)
        }
    } else {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    */
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})