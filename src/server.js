const express = require('express');
const cors = require('cors');
const personRouter = require('./routes/persons.js')
const infoRouter = require('./routes/info.js')
const morgan = require('morgan');
const path = require('path');
const morganMiddleware = require('./middleware/morgan.js');
const { errorHandler } = require('./error-handling/error-handler.js');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const mongo_Url = process.env.MONGODB_URI;

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());

mongoose.connect(mongo_Url);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

app.use(express.static(path.resolve('./dist')));
app.get('/', (req, res) => {
    res.sendFile(path.resolve('./dist/index.html'));
});
app.get('/addContact', (req, res) => {
    res.sendFile(path.resolve('./dist/addContact.html'));
});

app.use(morganMiddleware, morgan(":method :url :status :res[content-length] - :response-time ms :body"));

app.use('/api/persons', personRouter);
app.use('/info', infoRouter);
app.use(errorHandler);

// start the server
app.listen(port, () => {
    console.log('app started!');
});