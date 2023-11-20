const endpoints = require('../endpoints.json')

exports.checkServerEndpoints = (req, res, next) => {
    res.status(200).json(endpoints)
}
