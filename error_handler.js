exports.handle404 = (req, res, next) => {
    res.status(404).send({message: 'Path Not Found'})
}


exports.handlePsqlErrors = (err, req, res, next) =>{
    if (err.code === "23502" || err.code === "23503" || err.code === "22P02") {
        res.status(400).send({message:'Bad Request'})
    } else {
        next(err)
    }
}

exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status && err.message) {
        res.status(err.status).send({ message: err.message })    
    } else {
        next(err)
    }
}

exports.handleServerErrors = (err, req, res, next) => {
    res.status(500).send({message: 'Internal Server Error'})
}