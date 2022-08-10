const { Pool } = require('pg');
const dotenv = require('dotenv').config();

module.exports = new Pool({
  user: 'postgres',
  password: process.env.PG_PASSWORD,
  database: 'projet_1',
  host: 'localhost',
  port: 5432
});
