const express = require('express');
const Database = require('../database/database');
const Person = require('../mongodb/mongoPerson');

const infoRouter = express.Router();

infoRouter.get('/', async (req, res, next) => {
    const date = new Date().toLocaleString('en-US');
    try {
        const countPeople = await Person.find({}).count();
        res.json(`Phonebook has info for ${countPeople} people\n${date} (United States Standard Time)`);
        res.end();
    } catch (error) {
        res.status(502).json('Cannot connect to the database');
        // next({ status: 502, message: 'Cannot connect to the database' });
    }
})

module.exports = infoRouter;

  