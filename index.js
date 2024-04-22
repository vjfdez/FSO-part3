const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

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
];

//Middlewares
app.use(cors());
app.use(express.json());
morgan.token('body', req => {
    return JSON.stringify(req.body)
});
app.use(morgan(':method :url :status :body'));

//Routes
app.get('/api/persons', (req, res) => {
    res.json(persons);
});

app.get('/info', (req, res)=> {
    let totalPersons = persons.length;

    res.send(`
    <p>Phonebook has info for ${totalPersons} people.</p>
    <p>${Date()}</p>
    `);
});

app.get('/api/persons/:id', (req, res)=> {
    const id = Number(req.params.id);
    const person = persons.find(person=> person.id === id)
    if(person){
        res.json(person);
    } else {
        res.status(204);
        res.send('<h1>Cannot find this register.</h1>');
    };
});

app.delete('/api/persons/:id', (req, res)=> {
    const id = Number(req.params.id);
    persons = persons.filter(person => person.id !== id);
    res.status(204);
});

const generateId = ()=> {
    return Math.ceil(Math.random() * (100 - 5 + 5) + 5);
};

app.post('/api/persons', (req, res)=> {
    const body = req.body;

    if(!body.name || !body.number){
        return res.status(400).json({
            error: 'Name or number missing.'
        });
    };

    if(persons.find(person => person.name === body.name)){
        return res.status(400).json({
            error: 'This name already exist.'
        });
    };

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    };

    persons = persons.concat(person);
    res.json(person);
});

//Port config
const PORT = process.env.PORT || 4001;
app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`);
});
