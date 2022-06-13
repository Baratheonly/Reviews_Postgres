const pool = require('../db/reviewsPostgres.js');

module.exports = {

  getReviews: (req, res) => {
    console.log('Getting reviews for product_id:', req.query.product_id);
    let query = `
      SELECT
      review_id,
      rating,
      summary,
      recommend,
      response,
      body,
      date,
      reviewer_name,
      helpfulness,
      (
        SELECT
          COALESCE (
              json_agg (
                json_build_object (
                  'id', photos.id,
                  'url', photos.url
                )
              )
            , '[]') AS photos
        FROM photos
        WHERE reviews.review_id=photos.review_id
      )
      FROM reviews
      WHERE product_id=$1 AND reviews.reported = false
      GROUP BY reviews.review_id
      ORDER BY helpfulness DESC;
    `
    pool.query(query, [req.query.product_id])
      .then(data => {
        let reviews = {
          product_id: req.query.product_id,
          results: data.rows
        }
        // console.log(reviews);
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