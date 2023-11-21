exports.handle404 = (req, res, next) => {
    res.status(404).send({ message: 'Not Found'})
}

exports.handleCustomErrors = (err, req, res, next) => {
    if(err.status && err.msg) {
        res.status(err.status).send({ message: err.msg })    
    } else {
        next(err)
    }
}

exports.handleServerErrors = (err, req, res, next) => {
    res.status(500).send({message: 'Internal Server Error'})
}