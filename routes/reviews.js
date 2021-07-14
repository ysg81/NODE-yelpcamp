const express = require('express')
const router = express.Router({mergeParams: true})
// req.params값을 유지하도록 하는 것

// error catch
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')

// define model
const Campground = require('../models/campground')
const Review = require('../models/review')
const {campgroundSchema, reviewSchema} = require('../joiSchemas')

const {isLoggedIn, isAuthor, isReviewAuthor, validateCampground, validateRivew} = require('../middleware')

router.post('/', isLoggedIn, validateRivew, catchAsync(async(req, res, next) => {
  // 1. campground 모델을 찾음
  const campground = await Campground.findById(req.params.id);
  // 2. review 모델을 생성함
  const review = new Review(req.body.review)

  review.author = req.user._id;

  // 3. review 모델을 campground모델에 push
  campground.reviews.push(review)

  // 4. 저장
  await review.save()
  await campground.save()

  /***** flash part *****/
  req.flash('success', 'Successfully create a review!')
  /***** flash part *****/

  res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async(req, res) => {
  const {id, reviewId} = req.params;
  /********not*********/
  await Review.findByIdAndDelete(reviewId);
  await Campground.findByIdAndUpdate(id, {$pull: { reviews: reviewId }})
  /********not*********/

  /***** flash part *****/
  req.flash('success', 'Successfully deleted a review!')
  /***** flash part *****/

  res.redirect(`/campgrounds/${id}`)
}))


module.exports = router