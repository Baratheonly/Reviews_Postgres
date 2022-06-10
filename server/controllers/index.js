const client = require('../db/reviewsPostgres.js');

module.exports = {

  getReviews: (req, res) => {
    console.log(req.query);
  },
  getMeta: (req, res) => {
    console.log(req.query);
  },
  addReview: (req, res) => {
    console.log(req.query);
  },
  addHelpful: (req, res) => {
    console.log(req.query);
  },
  addReport: (req, res) => {
    console.log(req.query);
  }

}