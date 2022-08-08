const userModel = require('../models/user');
const database = require('../config/db');
const { checkModelFields } = require('./base');

exports.checkUserModel = (req, res, next) => {
  /** Check fields value */
  if (!checkModelFields(req.body, userModel))
    return res.status(422).send({ error: 'Invalid field value' });

  next();
}

exports.checkUserAlreadyExist = (req, res, next) => {
  /** Check if user already exist */
  database.query(`SELECT COUNT(1) FROM users WHERE email_address = '${req.body.email}'`)
    .then(response =>
      response.rows[0].count == 0
      ? next()
      : res.status(409).send({ error: 'User already exist' })
    )
    .catch(error => res.status(500).send({ error: error }));
}