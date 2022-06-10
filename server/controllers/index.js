const pool = require('../db/reviewsPostgres.js');

module.exports = {

  getReviews: (req, res) => {
    console.log(req.query.product_id);
    let query = `SELECT * FROM reviews WHERE product_id = $1;`
    pool.query(query, [req.query.product_id])
      .then(data => {
        let reviews = {
          product_id: req.query.product_id,
          results: data.rows
        }
        console.log(reviews);
        res.status(200).send(reviews);
      })
      .catch(err => {
        console.error(err);
        res.status(400).send(err);
      })
  },
  getMeta: (req, res) => {
    console.log(req.query);
  },
  addReview: (req, res) => {
    console.log(req.body);
  },
  addHelpful: (req, res) => {
    console.log(req.body);
  },
  addReport: (req, res) => {
    console.log(req.body);
  }

}