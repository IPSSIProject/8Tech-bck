const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

const verifyUserToken = (req) => {
  const token = req.get('Authorization');
  const SECRET_KEY = process.env.JWT_SECRET_KEY;

  if (token) {
    return jwt.verify(token.split(' ')[1], SECRET_KEY, { algorithms: ['HS256'] }, (error, decoded) => {
      if (error) {
        console.log(error);
        return false
      }
      return decoded
    });
  } else {
    return false;
  }
}

/** Function that compare fields value with model regex */
exports.checkModelFields = (model) => {
  return (req, res, next) => {
    for (const field in model) {
      if (!model[field].test(req.body[field])) {
        return res.status(422).send({ error: 'Invalid field value' });
      }
    }
    next();
  }
}

/** Verify if request param is type of number */
exports.checkIfParamIsNumber = (req, res, next) => {
  const isNumber = /^[0-9]+$/;

  for (const id in req.params)
    if (!isNumber.test(req.params[id]))
      return res.status(422).send({ error: 'Invalid parameter' });
  return next();
}

/** Verify only token format */
exports.checkUserTokenFormat = (req, res, next) => {
  verifyUserToken(req)
    ? next()
    : res.status(401).status({ error: 'Invalid token' });
}

/** Verify token format and user id */
exports.checkUserTokenId = (userId) => {
  return (req, res, next) => {
    const token = verifyUserToken(req);
    if (token) {
      console.log(req.params[userId])
      token.id == req.params[userId] || token.role == 1
        ? next()
        : res.status(401).send({ error: 'Not authorized' });
    } else {
      res.status(401).send({ error: 'Invalid token' });
    }
  }
}