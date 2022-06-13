var {getReviews, getMeta, addReview, addHelpful, addReport} = require('./controllers');
var router = require('express').Router();

router.get('/', getReviews);
router.get('/meta', getMeta);
router.post('/', addReview);
router.put('/:review_id/helpful', addHelpful);
router.put('/:review_id/report', addReport);

module.exports = router;