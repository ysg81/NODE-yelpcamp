const express = require('express')
const router = express.Router()

// error catch
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')

// define model
const Campground = require('../models/campground')
const {campgroundSchema, reviewSchema} = require('../joiSchemas')

const {isLoggedIn} = require('../middleware')

// Joi 사용법 - campground
const validateCampground = (req, res, next) => {    
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

router.get('/', catchAsync(async(req, res) => {
  const campgrounds = await Campground.find({})
  res.render('campgrounds/index', {campgrounds})
}))

router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new')
})

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
  const newcampground = new Campground(req.body.campground)
  await newcampground.save();

  /***** flash part *****/
  req.flash('success', 'Successfully made a campground!')
  /***** flash part *****/

  res.redirect(`/campgrounds/${newcampground._id}`)

}))

router.get('/:id', isLoggedIn, catchAsync(async(req, res) => {
  const a_campground = await Campground.findById(req.params.id).populate('reviews')
  
  /***** flash part *****/
  if(!a_campground){
    req.flash('error', 'Cannot find that campground!')
    return res.redirect('/campgrounds')
  }
  /***** flash part *****/

  res.render('campgrounds/show', {a_campground})
}))

router.get('/:id/edit', isLoggedIn, catchAsync(async(req, res) => {
  const editcampground = await Campground.findById(req.params.id)

  /***** flash part *****/
  if(!editcampground){
    req.flash('error', 'Cannot find that campground!')
    return res.redirect('/campgrounds')
  }
  /***** flash part *****/

  res.render('campgrounds/edit', {editcampground})
}))

router.put('/:id', isLoggedIn, validateCampground, catchAsync(async(req, res, next) => {
  const {id} = req.params
  const editcampground = await Campground.findByIdAndUpdate(id, {...req.body.campground})

  /***** flash part *****/
  req.flash('success', 'Successfully updated a campground!')
  /***** flash part *****/

  res.redirect(`/campgrounds/${editcampground._id}`)
}))

router.delete('/:id', isLoggedIn, catchAsync(async(req, res) => {
  const {id} = req.params
  await Campground.findByIdAndDelete(id)

  /***** flash part *****/
  req.flash('success', 'Successfully deleted a campground!')
  /***** flash part *****/
  
  res.redirect('/campgrounds')
}))


module.exports = router