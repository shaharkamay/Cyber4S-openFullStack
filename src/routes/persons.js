const express = require('express');
const Database = require('../database/database');
const Person = require('../mongodb/mongoPerson');

const personRouter = express.Router();

personRouter.get('/', async (req, res, next) => {
    try {
        const persons = await Person.find({});
        res.json(persons);
        res.end();
    } catch (error) {
        // res.status(404).json('Phonebook not found!');
        next({ status: 404, message: 'Phonebook not found!' });
    }
})

personRouter.get('/:id', async (req, res, next) => {
    const id = req.params.id;
    // const db = new Database('./phonebooks');
    // const data = db.get('phonebook1');
    try {
        const person = await Person.find({ _id: id });
        if(person) {
            res.json(person);
            res.end();
        } else {
            // res.status(404).json('Person not found!');
            next({ status: 404, message: 'Person not found!' });
        }
    } catch (error) {
        // res.status(502).json('Cannot connect to the database');
        next({ status: 502, message: 'Cannot connect to the database' });
    }
})


personRouter.delete('/:id', async (req, res, next) => {
    const id = Number(req.params.id);
    try {
        const isDeleted = (await Person.collection.deleteOne({ _id: id })).deletedCount > 0;
        if(isDeleted) {
            res.json('person deleted successfully');
            res.end();
        } else {
            // res.status(404).json('Person not found!');
            next({ status: 404, message: 'Person not found!' });
        }
    } catch (error) {
        // res.status(502).json('Cannot connect to the database');
        next({ status: 502, message: 'Cannot connect to the database' });
    }
})

personRouter.post('/', async (req, res, next) => {
    const person = Object.assign({}, req.body);
    if(person.hasOwnProperty('name') && person.hasOwnProperty('number')) {
        person.id = generateId();
        // if(await isNameExists(person.name)) {
            // next({ status: 409, message: 'Person already exists!' });
        // } else {
        try {
            await createNewPerson(person.id, person.name, person.number);
            res.json("Person added successfully!");
            res.end();
        } catch (error) {
            next({ status: 409, message: error._message });
        }
        // }
    } else {
        // res.status(400).json('Bad Request!');
        return next({ status: 400, message: 'Bad Request!' });
    }
})

personRouter.put("/", async (req, res, next) => {
    const newPerson = Object.assign({}, req.body);
    if (
    !newPerson.hasOwnProperty("name") ||
    !newPerson.hasOwnProperty("number")
    ) {
        // res.status(400).json('Bad Request!');
        // next({ status: 400, message: 'Bad Request!' });
    } else {
        if (await isNameExists(newPerson.name)) {
            if (await updatePerson(newPerson.name, newPerson.number)) {
                res.json(`Updated ${newPerson.name}`);
                res.end();
            } else {
                next({ status: 502, message: 'Cannot connect to the database' });
            }
        } else {
            next({ status: 404, error: "Name Not Found!" });
        }
    }
});
  

function generateId() {
    return Number(Math.random().toString(10).substr(2, 4));
}

async function createNewPerson(id, name, number) {
    const person = new Person({ _id: id, name: name, number: number });
    // try {
    await person.save();
    //     return true;
    // } catch (error) {
    //     return false;
    // }
}

async function isNameExists(name) {
    const persons = await Person.find({});
    return persons.findIndex((obj) => obj.name === name) !== -1;
}

async function updatePerson(name, number) {
    const isUpdated = (await Person.updateOne({ name: name }, { number: number })).matchedCount > 0;
    return isUpdated;
}
  
  

module.exports = personRouter;