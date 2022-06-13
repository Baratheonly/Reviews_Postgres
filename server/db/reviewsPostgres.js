const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DBHOST,
  port: process.env.DBPORT,
  user: process.env.DBUSER,
  database: process.env.DBNAME,
  password: process.env.DBPASSWORD
})

pool.connect();

module.exports = pool;