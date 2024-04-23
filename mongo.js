const mongoose = require('mongoose');
const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI);

const personSchema = new mongoose.Schema({
    name: String,
    number: String
});

const Person = mongoose.model('Person', personSchema);

if(process.argv.length === 3){
    console.log('Getting all registres.');

    Person.find({}).then(result => {
        console.log('Phonebook: ');
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`);
        })
        mongoose.connection.close();
    })    
};

if(process.argv.length > 3){    
    const person = new Person({
        name,
        number
    });

    person.save().then(result => {
        console.log(`Added ${result.name} number ${result.number} to phonebook.`);
        mongoose.connection.close();
    })
};