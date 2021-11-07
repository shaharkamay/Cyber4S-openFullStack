const express = require('express');
const morgan = require('morgan');
const apiRouter = require('./routes/api.js')
const infoRouter = require('./routes/info.js')

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());


morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.use('/api', apiRouter);
app.use('/info', infoRouter);

// start the server
app.listen(port, () => {
    console.log('app started');
});