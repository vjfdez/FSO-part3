const express = require('express');
const app = express();
require('dotenv').config();
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

// let persons = [
//     { 
//       "id": 1,
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": 2,
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": 3,
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": 4,
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ];

//Middlewares
app.use(express.static('dist'));
app.use(cors());
app.use(express.json());
morgan.token('body', req => {
    return JSON.stringify(req.body)
});
app.use(morgan(':method :url :status :body'));      

//MongoDB import model
const Person = require('./models/person');

//Routes
app.get('/api/persons', (req, res) => {
    Person.find({}).then(result => {
        console.log(result);
        res.json(result);
    }) 
});

app.get('/info', (req, res)=> {
    Person.find({}).then(result => {
        console.log(result.length);

        res.send(`
            <p>Phonebook has info for ${result.length} people.</p>
            <p>${Date()}</p>
        `);
    }) 
});

app.get('/api/persons/:id', (req, res)=> {
    Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      res.status(500).end()
    })
});

app.delete('/api/persons/:id', (req, res, next)=> {
    Person.findByIdAndDelete(req.params.id)
        .then(result => {
            console.log(result);
            res.status(204).end();
        })
        .catch(error => next(error))
});

app.post('/api/persons', (req, res, next)=> {
    const body = req.body;

    if(!body.name || !body.number){
        return res.status(400).json({
            error: 'Name or number missing.'
        });
    };

    const person = new Person({
        name: body.name,
        number: body.number
    });

    person.save().then(result => {
        console.log(`Added ${result.name} number ${result.number} to phonebook.`);
        res.status(200);
    })
    .catch(error => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
    const { name, number } = req.body;

    Person.findByIdAndUpdate(
        req.params.id, 
        { name, number },
        { new: true, runValidators: true, context: 'query'}
    )
        .then(updatedNote => {
            res.json(updatedNote);
        })
        .catch(error => next(error));
});

//Controlador de errores.
const errorHandler = (error, req, res, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' });
    } else if(error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
    }
    next(error);
};

app.use(errorHandler);

//Port config               
const PORT = process.env.PORT || 4001;
app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`);
});
