exports.handlePsqlErrors = (err, req, res, next) =>{}

exports.handleCustomErrors = (err, req, res, next) => {}

exports.handleServerErrors = (err, req, res, next) => {
    res.status(500).send('Internal Server Error')
}

exports.handle404 = (req, res, next) => {
    res.status(404).send({ message: 'Path Not Found'})
}