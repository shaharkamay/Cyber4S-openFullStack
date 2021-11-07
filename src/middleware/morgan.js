const morgan = require('morgan');


module.exports = (req, res, next) => { 
    morgan.token("body", (req, res) => JSON.stringify(req.body)); 
    next();
}
