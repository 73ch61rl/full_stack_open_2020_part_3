const express = require('express')
const app = express()
app.use(express.json())
const morgan = require('morgan')
morgan.token('content', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan("method: :method, url: :url, status: :status, content-length: :res[content-length], response time: :response-time ms, content :content"))
let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    response.send(
        `<p>Phonebook has info for ${persons.length} people.</p>
     <p>${new Date()}.</p>`)
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
    persons = persons.filter(person => person.id !== id)
    //status code for nonexisting content
    response.status(204).end()
})

const generatePersonId = () => {
    return Math.floor(Math.random() * 100000000);
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    const duplicatedName = persons.find(person => person.name === body.name)
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "Person's name and number are required!"
        })
    }
    else if (duplicatedName) {
        return response.status(400).json({
            error: "A person with this name already exists! Choose a different name!"
        });
    }
    else {
        const person = {
            id: generatePersonId(),
            name: body.name,
            number: body.number,
        }
        persons = persons.concat(person)
        response.json(person)
    }
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})