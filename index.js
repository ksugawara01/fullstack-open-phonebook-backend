require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./models/person')
const app = express()

app.use(express.static('build'))
app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())

//This is an object constructor
//const Person = mongoose.model('Person', personSchema)

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })

app.get('/info', (request, response) => {
    response.send(`Phonebook has info for ${persons.length} people
    <br/>${new Date()}`)
    
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then((person) => {
        response.json(person)
    })
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id != id)

    response.status(204).end()
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