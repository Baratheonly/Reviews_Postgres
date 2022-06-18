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

  getMeta: (req, res) => {
    let {product_id} = req.query;
    let char_id;

    const getRatingsCount = (rating) => {
      return `SELECT COUNT(rating)
              FROM reviews
              WHERE product_id=$1 AND rating=${rating}`
    }

    const getRecommendCount = (bool) => {
      return `SELECT COUNT(recommend)
              FROM reviews
              WHERE product_id=$1 AND recommend=${bool}`
    }

    const getCharacteristicID = (ristic) => {
      return `SELECT id
              FROM characteristics c
              WHERE product_id=$1 AND name=${ristic}`
    }

    const getValueCount = (ristic) => {
      return `SELECT (SUM(value::decimal)/COUNT(value))
              AS value
              FROM characteristic_reviews
              WHERE characteristic_id=(${getCharacteristicID(ristic)})`
    }

    const buildObject = (ristic) => {
      return `SELECT json_build_object(
                'id', (${getCharacteristicID(ristic)}),
                'value', (${getValueCount(ristic)})
             )`
    }

    let metaQuery = `
      SELECT
        $1::integer AS product_id,
        (SELECT json_build_object(
          '1', (${getRatingsCount('$2')}),
          '2', (${getRatingsCount('$3')}),
          '3', (${getRatingsCount('$4')}),
          '4', (${getRatingsCount('$5')}),
          '5', (${getRatingsCount('$6')})
        )) AS ratings,
        (SELECT json_build_object(
          'false', (${getRecommendCount('$7')}),
          'true', (${getRecommendCount('$8')})
        )) AS recommend,
        (SELECT json_build_object(
          $9::text, (${buildObject('$9')}),
          $10::text, (${buildObject('$10')}),
          $11::text, (${buildObject('$11')}),
          $12::text, (${buildObject('$12')})
        )) AS characteristics
    `
    pool.query(metaQuery, [product_id, 1, 2, 3, 4, 5, false, true, 'Fit', 'Length', 'Comfort', 'Quality'])
      .then(data => res.send(data.rows[0]))
      .catch(err => console.error(err));
  },

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
        review_id = data.rows[0].review_id;
        let photosQuery = `
          INSERT INTO photos(review_id, url)
          SELECT $1, UNNEST($2::text[])
          RETURNING *
        ;`
        return pool.query(photosQuery, [review_id, photos])
      })
      .then(data => {
        console.log(data.rows[0])
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