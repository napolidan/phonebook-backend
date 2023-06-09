const express  = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

const Person = require('./models/person')
const { response } = require('express')

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if(error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    next(error)
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

app.get('/info', (request, response) => {

    const date = new Date()

    const personList = Person.find({})
    .then(persons => {
        response.send(`<p>Phonebook has info for ${persons.length} people</p>
        <p>${date}</p>`)
    })

})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.post('/api/persons', (request, response) =>{
    const body = request.body

    if (body.name == undefined || body.number == undefined) {
        return response.status(404).json({
            error: 'content missing'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })

})

app.get('/api/persons/:id', (request, response, next) => {

    Person.findById(request.params.id)
    .then(person => {
        if (person){
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))

})

app.delete('/api/persons/:id', (request, response, next) => {
    const body = request.body

    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id' , (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id , person , { new:true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})