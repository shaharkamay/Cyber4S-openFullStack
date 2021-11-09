const express = require('express');
const Database = require('../database/database');
const Person = require('../mongodb/mongoPerson');

const infoRouter = express.Router();

infoRouter.get('/', async (req, res, next) => {
    const date = new Date().toLocaleString('en-US');
    const countPeople = await Person.find({}).count();
    // const db = new Database('./phonebooks');
    // const data = db.get('phonebook1');
    // console.log(`Phonebook has info for ${data.value.length} people\n${date} (United States Standard Time)`)
    res.json(`Phonebook has info for ${countPeople} people\n${date} (United States Standard Time)`);
    res.end();
})

module.exports = infoRouter;

// infoRouter.get("/", async (request, response) => {
//     response.send(
//       `Phonebook has info for ${await Person.find(
//         {}
//       ).count()} peaple.\n${new Date()}`
//     );
//   });
  