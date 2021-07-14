/******* error 생성 순서 ******* */
/*1. app.use(err)라우터 만들기  */
/*2. async error catch하기 */
/*3. throw new error(class제작 가능) */
/*4. 모든 과정을 통과할 경우 404 => app.all('*')에 대하여 */

/*중복 제거*/
// const Joi = require('joi')
// const catchAsync = require('./utils/catchAsync')
// const Campground = require('./models/campground')
// const Review = require('./models/review')
// const {campgroundSchema, reviewSchema} = require('./joiSchemas')


const express = require('express')
const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')


const ExpressError = require('./utils/ExpressError')

// mongoose model
const mongoose = require('mongoose')
const User = require('./models/user')

// router
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/users')

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
app.use(express.static(path.join(__dirname, 'public')))

// // session 정보
const sessionConfig = {
  secret: 'however',
  resave : false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}
app.use(session(sessionConfig))
app.use(flash())

// passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// flash middleware 생성
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next()
})

app.get('/fake', async(req,res) => {
  const user = new User({email: 'ysg123@naver.com', username:'ysg'})
  const newUser = await User.register(user, 'hello')
  res.send(newUser)
})

// campground router 분리
app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)

app.get('/', (req, res) => {
  res.render('home')
})

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