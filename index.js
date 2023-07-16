const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

app.use(express.json());
app.use(morgan(':method :url :body'));
app.use(cors());
app.use(express.static('build'));

morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});

let persons = [
  {
    name: 'Arto Hellas',
    number: '050-2345897',
    id: 1
  },
  {
    name: 'Ada Lovelace',
    number: '045-7894562',
    id: 2
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 3
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: 4
  }
];

let numberOfPersons = persons.length;

let dateTime = Date();

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/info', (request, response) => {
  response.send(
    `<p>Phonebook has info for ${numberOfPersons} people </p> <p>${dateTime}</p>`
  );
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
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
  } else if (personExisted) {
    return response.status(400).json({
      error: 'Person already exists'
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  };

  persons = persons.concat(person);

  response.json(person);
});

morgan.token('id', function getId(req) {
  return req.id;
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
