exports.checkServerUp = (req, res, next) => {
    res.status(200).send({ message: 'server is up and running..!'})
}