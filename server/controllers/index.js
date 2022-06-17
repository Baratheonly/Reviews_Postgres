const pool = require('../db/reviewsPostgres.js');

module.exports = {

  getReviews: (req, res) => {
    let page = req.query.page || 1;
    let count = req.query.count || 5;
    let sort = req.query.sort || 'relevant';

    if (sort === 'helpful') {
      sort = 'helpfulness';
    } else {
      sort = 'date'
    }

    let query = `
      SELECT review_id, rating, summary, recommend, response, body, date, reviewer_name, helpfulness,
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
      ORDER BY ${sort} DESC
      LIMIT ${count}
      OFFSET ${count * (page - 1)}
    ;`
    pool.query(query, [req.query.product_id])
      .then(data => {
        let reviews = {
          product_id: req.query.product_id,
          page: page,
          count: count,
          results: data.rows
        }
        res.status(200).send(reviews);
      })
      .catch(err => {
        console.error('problem getting reviews -->', err)
        res.status(400).send(err);
      })
  },

  // {
  //   "product_id": "40344",
  //   "ratings": {
  //       "1": "69",
  //       "2": "68",
  //       "3": "160",
  //       "4": "150",
  //       "5": "338"
  //   },
  //   "recommended": {
  //       "false": "170",
  //       "true": "615"
  //   },
  //   "characteristics": {
  //       "Fit": {
  //           "id": 135219,
  //           "value": "3.2447698744769874"
  //       },
  //       "Length": {
  //           "id": 135220,
  //           "value": "3.4004237288135593"
  //       },
  //       "Comfort": {
  //           "id": 135221,
  //           "value": "3.2488038277511962"
  //       },
  //       "Quality": {
  //           "id": 135222,
  //           "value": "3.2710706150341686"
  //       }
  //   }
  // }

  // getMeta: (req, res) => {
  //   console.log(req.query);
  //   let {product_id} = req.query;

  //   let queryMeta = `
  //     SELECT
  //       $1 AS product_id,
  //       () AS rating,
  //       (SELECT
  //         json_object_agg (
  //           'false',
  //         )
  //       ) AS recommended,
  //       () AS characteristics
  //   `
  // },

  addReview: (req, res) => {
    // console.log(req.body);
    let timeAdded = new Date().toISOString();
    let body = Object.values(req.body);
    let {photos} = req.body;
    let review_id;

    let query = `
      INSERT INTO reviews (
        product_id, rating, summary, body, recommend, reviewer_name, reviewer_email, date
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8
      )
      RETURNING review_id
    ;`
    pool.query(query, [...body.slice(0, body.length - 1), timeAdded])
      .then(data => {
        // console.log('hey, look at this review_id:', rev_id);
        review_id = data.rows[0].review_id;;
        let photosQuery = `
          INSERT INTO photos(review_id, url)
          SELECT $1, UNNEST($2::text[])
          RETURNING *
        ;`
        return pool.query(photosQuery, [review_id, photos])
      })
      .then(data => {
        // console.log(data.rows[0])
        res.status(200).send(`Review added (review_id: ${review_id})`)
      })
      .catch(err => console.error('error adding photos -->', err))
  },

  addHelpful: (req, res) => {
    // console.log(req.params.review_id);
    let query = `
      UPDATE reviews
      SET helpfulness = helpfulness+1
      WHERE review_id = $1
    `

    pool.query(query, [req.params.review_id])
      .then(() => res.status(200).send(`review marked as helpful`))
      .catch(err => console.error('helpfulness error:', err));
  },

  addReport: (req, res) => {
    let query = `
      UPDATE reviews
      SET reported = NOT reported
      WHERE review_id = $1
    `

    pool.query(query, [req.params.review_id])
      .then(data => res.status(200).send('review has been flagged as "reported"'))
      .catch(err => console.error('report error:', err));
  }

}

// SELECT * FROM UNNEST(
//   ARRAY${Array(req.body.photos.length).fill(`
//     SELECT lastval() FROM reviews
//   `)}::int[],
//   ARRAY$1::text[]
// )