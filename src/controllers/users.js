const database = require('../config/db');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

/** User creation controller */
exports.registration = (req, res) => {
  const user = req.body;
  const request = `INSERT INTO users (firstname, lastname, email_address, password)
                   VALUES ('${user.firstname}', '${user.lastname}', '${user.email}', '${user.password}')`;

  database.query(request)
    .then(response => res.status(201).send(response))
    .catch(error => res.status(500).send({ error: error }));
}

/** User authentication controller */
exports.authentication = (req, res) => {
  const { email, password } = req.body;
  const SECRET_KEY = process.env.JWT_SECRET_KEY;
  const request = `SELECT id FROM users WHERE email_address = '${email}' 
                   AND password = '${password}'`;

  database.query(request)
    .then(response => {
      if (response.rows[0]) {
        /** Create token with an expiration time of 1 hour */
        const token = jwt.sign(
          {
            id: response.rows[0].id,
            role: 0
          },
          SECRET_KEY,
          {
            algorithm: 'HS256',
            expiresIn: 60 * 60
          }
        );
        res.status(200).send({ token: token })
      } else {
        res.status(404).send({ error: 'User not found' })
      }
    })
    .catch(error => res.status('500').send({ error: error }));
}

/** Get all users */
exports.getAllUsers = (req, res) => {
  const request = 'SELECT * FROM users';

  database.query(request)
    .then(response => res.status(200).send(response.rows))
    .catch(error => res.status(500).send({ error: error }));
}

/** Get one user */
exports.getUser = (req, res) => {
  const { id } = req.params;
  const request = `SELECT * FROM users WHERE id = '${id}'`;

  database.query(request)
    .then(response => response.rows[0]
      ? res.status(200).send(response.rows)
      : res.status(404).send({ error: 'User not found' })
    )
    .catch(error => res.status(500).send({ error: error }));
}

/** Update one user */
exports.updateUser = (req, res) => {
  const { id } = req.params;
  const user = req.body;
  const request = `UPDATE users
                   SET firstname = '${user.firstname}', lastname = '${user.lastname}', 
                   email_address = '${user.email}', password = '${user.password}'
                   WHERE id = ${id} RETURNING *;`

  database.query(request)
    .then(response => response.rows[0]
      ? res.status(200).send(response.rows)
      : res.status(404).send({ error: 'User not found' })
    )
    .catch(error => res.status(500).send({ error: error }));
}

/** Delete one user */
exports.deleteUser = (req, res) => {
  const { id } = req.params;
  const request = `DELETE FROM users WHERE id = '${id}' RETURNING id`;

  database.query(request)
    .then(response =>
      response.rows[0]
        ? res.status(200).send(response)
        : res.status(404).send({ error: 'User not found' })
    )
    .catch(error => res.status(500).send({ error: error }));
}
