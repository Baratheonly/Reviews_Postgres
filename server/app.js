const express = require('express');
const router = require('./routes.js');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use('/reviews', router);

app.get(`/loaderio-f5642590d5870794bf320a1782ef1224`, (req, res) => {
  res.send(`loaderio-f5642590d5870794bf320a1782ef1224`);
});

app.listen(process.env.EXPRESSPORT, () => {
  console.log(`Listening on Express Port ${process.env.EXPRESSPORT}`);
})