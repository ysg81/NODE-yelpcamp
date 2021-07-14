const Review = require('../models/review')

module.exports.createReview = async(req, res, next) => {
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
}

module.exports.deleteReview = async(req, res) => {
  const {id, reviewId} = req.params;
  /********not*********/
  await Review.findByIdAndDelete(reviewId);
  await Campground.findByIdAndUpdate(id, {$pull: { reviews: reviewId }})
  /********not*********/

  /***** flash part *****/
  req.flash('success', 'Successfully deleted a review!')
  /***** flash part *****/

  res.redirect(`/campgrounds/${id}`)
}