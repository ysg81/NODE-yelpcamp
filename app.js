/******* error 생성 순서 ******* */
/*1. app.use(err)라우터 만들기  */
/*2. async error catch하기 */
/*3. throw new error(class제작 가능) */
/*4. 모든 과정을 통과할 경우 404 => app.all('*')에 대하여 */

const express = require('express')
const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const Joi = require('joi')
const {campgroundSchema, reviewSchema} = require('./joiSchemas')

const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')

const mongoose = require('mongoose')
const Campground = require('./models/campground')
const Review = require('./models/review')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connections error:"))
db.once("open", () => {
  console.log("Database connected");
})

const app = express()

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))



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

// Joi 사용법 - review
const validateRivew = (req, res, next) => {
  console.log(req.body)
  const {error} = reviewSchema.validate(req.body)
  if(error){
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400)
  } else{
    next()
  }
}


app.get('/', (req, res) => {
  res.render('home')
})

app.get('/campgrounds', catchAsync(async(req, res) => {
  const campgrounds = await Campground.find({})
  res.render('campgrounds/index', {campgrounds})
}))

app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new')
})

app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
    const newcampground = new Campground(req.body.campground)
    await newcampground.save();
    res.redirect(`/campgrounds/${newcampground._id}`)
}))

app.get('/campgrounds/:id', catchAsync(async(req, res) => {
  const a_campground = await Campground.findById(req.params.id).populate('reviews')
  console.log(a_campground)
  res.render('campgrounds/show', {a_campground})
}))

app.get('/campgrounds/:id/edit', catchAsync(async(req, res) => {
  const editcampground = await Campground.findById(req.params.id)
  res.render('campgrounds/edit', {editcampground})
}))

app.put('/campgrounds/:id', catchAsync(async(req, res) => {
  const {id} = req.params
  const editcampground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
  res.redirect(`/campgrounds/${editcampground._id}`)
}))

app.delete('/campgrounds/:id', catchAsync(async(req, res) => {
  const {id} = req.params
  await Campground.findByIdAndDelete(id)
  res.redirect('/campgrounds')
}))

app.post('/campgrounds/:id/reviews', validateRivew, catchAsync(async(req, res, next) => {
  // 1. campground 모델을 찾음
  const campground = await Campground.findById(req.params.id);
  // 2. review 모델을 생성함
  const review = new Review(req.body.review)
  // 3. review 모델을 campground모델에 push
  campground.reviews.push(review)
  // 4. 저장
  await review.save()
  await campground.save()
  res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async(req, res) => {
  const {id, reviewId} = req.params;
  /********not*********/
  await Review.findByIdAndDelete(reviewId);
  await Campground.findByIdAndUpdate(id, {$pull: { reviews: reviewId }})
  /********not*********/
  res.redirect(`/campgrounds/${id}`)
}))

// 모든 path를 통과하고, 주어진 모든 err를 건너뛰고 err가 발생할 경우
app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
  const {statusCode = 500} = err
  if(!err.message) err.message = "Error!"
  res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
  console.log('Serving on port 3000')
})