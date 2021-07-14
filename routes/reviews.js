const express = require('express')
// req.params값을 유지하도록 하는 것
const router = express.Router({mergeParams: true})
// error catch
const catchAsync = require('../utils/catchAsync')
const {isLoggedIn, isAuthor, isReviewAuthor, validateCampground, validateRivew} = require('../middleware')

// controller
const reviews = require('../controllers/reviews')

router.post('/', isLoggedIn, validateRivew, catchAsync(reviews.createReview))
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router