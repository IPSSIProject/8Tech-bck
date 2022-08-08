const database = require('../config/db');
const jwt = require('jsonwebtoken');

exports.getAllCategories = (req, res) => {
    const request = 'SELECT * FROM categories';

    //Execute request
    database.query(request)
        .then(response => res.status(200).send(response.rows))
        .catch(error => res.status(500).send(error));
}
