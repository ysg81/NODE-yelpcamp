const {campgroundSchema, reviewSchema} = require('./joiSchemas')
const ExpressError = require('./utils/ExpressError')
const Campground = require('./models/campground')
const Review = require('./models/review')

module.exports.isLoggedIn = (req, res, next) => {
  
  if(!req.isAuthenticated()){
    req.flash('error', 'you must be signed in!')
    return res.redirect('/login')
  }
  next()
}

// Joi 사용법 - campground
module.exports.validateCampground = (req, res, next) => {    
  console.log(req.body)
  const {error} = campgroundSchema.validate(req.body);
  if(error){
    // detail의 개수가 1개 이상일 경우
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400)
  } else{
    next()
  }
}

// Joi 사용법 - review
module.exports.validateRivew = (req, res, next) => {
  console.log(req.body)
  const {error} = reviewSchema.validate(req.body)
  if(error){
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400)
  } else{
    next()
  }
}

module.exports.isAuthor = async(req, res, next) => {
  const {id} = req.params
  const validatecampground = await Campground.findById(id);
  if (!validatecampground.author.equals(req.user._id)){
    
    /***** flash part *****/
    req.flash('error', 'You do not have permission to do that!')
    /***** flash part *****/

    return res.redirect(`/campgrounds/${id}`)
  }
  next()
}

module.exports.isReviewAuthor = async(req, res, next) => {
  const {id, reviewId} = req.params
  const validatereview = await Review.findById(reviewId);
  if (!validatereview.author.equals(req.user._id)){
    
    /***** flash part *****/
    req.flash('error', 'You do not have permission to do that!')
    /***** flash part *****/

    return res.redirect(`/campgrounds/${id}`)
  }
  next()
}