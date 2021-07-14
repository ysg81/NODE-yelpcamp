const express = require('express')
const router = express.Router()
const User = require('../models/user')
const passport = require('passport')

// error catch
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')

router.get('/register', (req, res) => {
  res.render('users/register')
})

router.post('/register', catchAsync(async(req, res) => {
  try{
    const {username, email, password} = req.body
    const user = new User({username, email})
    const registeredUser = await User.register(user, password)
    console.log(registeredUser)
    req.flash('success', 'Welcome to Yelp Camp!')
    res.redirect('/campgrounds')
  }
  catch(err){
    req.flash('error', err.message)
    res.redirect('/register')
  }
}))

router.get('/login', (req,res) => {
  res.render('users/login')
})

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), catchAsync(async(req,res) => {
  req.flash('success', 'Welcome back!')
  res.redirect('/campgrounds')

}))


module.exports = router