const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  port: process.env.DBPORT,
  database: 'sdc',
  password: process.env.DBPASSWORD
})

pool.connect()

module.exports = pool;