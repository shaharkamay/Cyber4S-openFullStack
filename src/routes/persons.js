const express = require('express');
const Database = require('../database/database');

const personRouter = express.Router();

personRouter.get('/', (req, res, next) => {
    const db = new Database('./phonebooks');
    if(db.isKeyExists('phonebook1')) {
        const data = db.get('phonebook1');
        res.json(data.value);
        res.end();
    } else {
        res.status(404).json('Phonebook not found!');
        // next({ status: 404, message: 'Phonebook not found!' });
    }
})

personRouter.get('/:id', (req, res, next) => {
    const id = req.params.id;
    const db = new Database('./phonebooks');
    const data = db.get('phonebook1');
    const person = data.value.find(person => person.id == id);
    if(person) {
        res.json(person);
        res.end();
    } else {
        res.status(404).json('Person not found!');
        // next({ status: 404, message: 'Person not found!' });
    }
})


personRouter.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    const db = new Database('./phonebooks');
    const data = db.get('phonebook1');
    const originalLength = data.value.length;
    const persons = data.value.filter((person) => person.id != id);
    if(persons.length !== originalLength) {
        data.value = persons;
        res.json('person deleted successfully');
        res.end();
    } else {
        res.status(404).json('Person not found!');
        // next({ status: 404, message: 'Person not found!' });
    }
})

personRouter.post('/', (req, res, next) => {
    const person = req.body.person;
    if(person.hasOwnProperty('name') && person.hasOwnProperty('number')) {
        person.id = generateId();
        const db = new Database('./phonebooks');
        const data = db.get('phonebook1');
        const persons = data.value;
        if(persons) {
            if(isPersonExists(persons, person.name)) {
                res.status(409).json('Person already exists!');
                // next({ status: 409, message: 'Person already exists!' });
            } else {
                persons.push(person);
                data.value = persons;
                res.json(persons);
                res.end();
            }
        } else {
            res.status(404).json('Persons not found!');
            // next({ status: 404, message: 'Persons not found!' });
        }
    } else {
        res.status(400).json('Bad Request!');
        // next({ status: 400, message: 'Bad Request!' });
    }
})

function generateId() {
    return Number(Math.random().toString(10).substr(2,4));
}

function isPersonExists(persons, name) {
    return persons.find((person) => person.name === name);
}

module.exports = personRouter;