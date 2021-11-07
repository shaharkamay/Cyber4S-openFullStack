const express = require('express');
const fs = require('fs');
const Database = require('../database/database');

const apiRouter = express.Router();

apiRouter.get('/persons', (req, res, next) => {
    const path = `./src/database/phonebooks/phonebook1.json`;
    const stringData = fs.readFileSync(path, 'utf-8');
    const data = JSON.parse(stringData);
    res.json(data);
    res.end();
})







module.exports = apiRouter;