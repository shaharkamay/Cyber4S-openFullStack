const express = require('express');
const personRouter = require('./routes/persons.js')
const infoRouter = require('./routes/info.js')
const morgan = require('morgan');
const morganMiddleware = require('./middleware/morgan.js');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(morganMiddleware, morgan(":method :url :status :res[content-length] - :response-time ms :body"));

app.use('/api/persons', personRouter);
app.use('/info', infoRouter);

// start the server
app.listen(port, () => {
    console.log('app started');
});