const express = require('express');
const Database = require('../database/database');

const infoRouter = express.Router();

infoRouter.get('/', (req, res, next) => {
    const date = new Date().toLocaleString('en-US');
    const db = new Database('./phonebooks');
    const data = db.get('phonebook1');

    res.json(`Phonebook has info for ${data.value.length} people\n${date} (United States Standard Time)`);
    res.end();
})

module.exports = infoRouter;