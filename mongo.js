const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:<password>@cluster0.z1hybnq.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log('Phonebook:');
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  });

  person.save().then((result) => {
    console.log(`Added ${person.name} number ${person.number} to phonebook`);
    mongoose.connection.close();
    console.log(process.argv);
  });
}

/*
const person = new Person({
  name: 'Ressu Redford',
  number: '040-4567981'
});
*/
