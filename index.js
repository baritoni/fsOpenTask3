require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const Person = require('./models/person');

app.use(express.json());
app.use(morgan(':method :url :body'));
app.use(cors());
app.use(express.static('build'));

morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});

//const url = `mongodb+srv://fullstack:<password>@cluster0.z1hybnq.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

//mongoose.set('strictQuery', false);
//mongoose.connect(url);

let persons = [];

let numberOfPersons = persons.length;

let dateTime = Date();

app.get('/api/persons', (request, response) => {
  Person.find({}).then((person) => {
    response.json(person);
    console.log(person);
  });
});

app.get('/info', (request, response) => {
  response.send(
    `<p>Phonebook has info for ${numberOfPersons} people </p> <p>${dateTime}</p>`
  );
});

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });
});

const generateId = () => {
  const randomId = Math.floor(Math.random() * 1000);
  return randomId;
};

app.post('/api/persons', (request, response) => {
  const body = request.body;
  const personExisted = persons.find((person) => person.name === body.name);
  // console.log('body: ', body);
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'Content missing'
    });
  } //else if (personExisted) {
  //return response.status(400).json({
  //error: 'Person already exists'
  //});
  else {
    const person = new Person({
      name: body.name,
      number: body.number
    });
    person.save().then((savedPerson) => {
      response.json(savedPerson);
    });
  }
});

app.delete('/api/persons/:id', (request, response, next) => {
  console.log(request);
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }

  next(error);
};

// tämä tulee kaikkien muiden middlewarejen rekisteröinnin jälkeen!
app.use(errorHandler);

morgan.token('id', function getId(req) {
  return req.id;
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
