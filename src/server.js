const express = require('express');
const apiRouter = require('./routes/api.js')

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/api', apiRouter)

// start the server
app.listen(port, () => {
    console.log('app started');
});