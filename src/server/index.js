const bodyParser = require('body-parser');
const express = require('express');
const routes = require('../routes');

module.exports = () => {
  const app = express();

  // Set up bodyParser
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // Setting headers to allow CORS
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  routes(app);

  return app;
}