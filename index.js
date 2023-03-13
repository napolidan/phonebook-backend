const express  = require('express')
const app = express()

app.use(express.json())

const cors = require('cors')

app.use(cors())

app.use(express.static('build'))


let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-2345345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]


const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return maxId
}

app.get('/info', (request, response) => {

    const maxId = generateId()

    const date = new Date()

    response.send(`<p>Phonebook has info for ${maxId} people</p>
    <p>${date}</p>`)
  })

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const contact = persons.find(person => person.id === id)

    if (contact) {
        response.json(contact)
    }
    else {
        response.status(404).end()
    }

})

app.post('/api/persons', (request, response) =>{
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    else if (persons.filter(person => person.name === body.name).length>0) {
        return response.status(400).json({ 
            error: 'name must be unique' 
        })
    }
    
    id = Math.round(Math.random() * 1000)

    const newPerson = {
        id : id,
        name: body.name,
        number: body.number
    }

    persons = persons.concat(newPerson)

    response.json(newPerson)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const contact = persons.filter(person => person.id != id)
    persons = contact

    response.status(204).end()
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})