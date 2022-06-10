const express = require('express');
const router = require('./routes.js');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/reviews', router);

app.listen(process.env.EXPRESSPORT, () => {
  console.log(`Listening on Express Port ${process.env.EXPRESSPORT}`);
})