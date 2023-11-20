

exports.handle404 = (req, res, next) => {
    res.status(404).send({ message: 'Path Not Found'})
}