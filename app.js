const express = require('express')
const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const Joi = require('joi')
const {campgroundSchema} = require('./joiSchemas')

const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')

const mongoose = require('mongoose')
const Campground = require('./models/campground')

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



const validateCampground = (req, res, next) => {    
  // joi 적용
  const {error} = campgroundSchema.validate(req.body);
  if(error){
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400)
  } else{
    next()
  }
  // Joi 사용법
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

app.post('/campgrounds', validateCampground,  catchAsync(async (req, res, next) => {
    const newcampground = new Campground(req.body.campground)
    await newcampground.save();
    res.redirect(`/campgrounds/${newcampground._id}`)
}))

app.get('/campgrounds/:id', catchAsync(async(req, res) => {
  const a_campground = await Campground.findById(req.params.id)
  res.render('campgrounds/show', {a_campground})
}))

app.get('/campgrounds/:id/edit', catchAsync(async(req, res) => {
  const editcampground = await Campground.findById(req.params.id)
  res.render('campgrounds/edit', {editcampground})
}))

app.put('/campgrounds/:id', validateCampground, catchAsync(async(req, res) => {
  const {id} = req.params
  const editcampground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
  res.redirect(`/campgrounds/${editcampground._id}`)
}))

app.delete('/campgrounds/:id', catchAsync(async(req, res) => {
  const {id} = req.params
  await Campground.findByIdAndDelete(id)
  res.redirect('/campgrounds')
}))

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