const morgan = require('morgan')


module.exports = (req, res, next) => { 
  morgan.token('body', (req) => JSON.stringify(req.body)) 
  next()
}
