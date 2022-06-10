var controller = require('./controllers');
var router = require('express').Router();

router.get('/', controller.getReviews);
router.get('/meta', controller.getMeta);
router.post('/', controller.addReview);
router.put('/:review_id/helpful', controller.addHelpful);
router.put('/:review_id/report', controller.addReport);

module.exports = router;