exports.handle404 = (req, res, next) => {
    res.status(404).send({ message: 'Not Found'})
}

exports.handlePsqlErrors = (err, req, res, next) => {
    if (err.code === "22P02") {
      res.status(400).send({ msg: 'Something Wrong With Input' });
    } else {
      next(err);
    }
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