const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  host: 'localhost',
  user: 'postgres',
  port: process.env.DBPORT,
  database: 'sdc',
  password: process.env.DBPASSWORD
})

client.connect()
  .then(() => console.log("Connected to Postgres"))
  .then(() => {
    let limit100 = `
      Select * from review_photos
      ORDER BY id DESC LIMIT 50
    `;

    return client.query(limit100)
  })
  .then(results => {
    console.table(results.rows);
  })
  .catch(e => console.log(e))
  .finally(() => client.end())
