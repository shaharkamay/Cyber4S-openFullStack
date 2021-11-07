const express = require('express');
const fs = require('fs');
const apiRouter = require('./routes/api.js')

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/info', (req, res, next) => {
    const date = new Date().toLocaleString('en-US');
    const path = `./src/database/phonebooks/phonebook1.json`;
    const stringData = fs.readFileSync(path, 'utf-8');
    const data = JSON.parse(stringData);

    res.json(`Phonebook has info for ${data.length} people\n${date} (United States Standard Time)`);
    res.end();

})

app.use('/api', apiRouter)

// start the server
app.listen(port, () => {
    console.log('app started');
});