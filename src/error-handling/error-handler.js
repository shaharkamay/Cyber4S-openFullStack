const errorHandler = (err, req, res, next) => {
  res.status(err.status).json({ message: err.message })
  res.end()
}

module.exports = { errorHandler }