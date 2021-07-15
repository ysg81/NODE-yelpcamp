const express = require('express')
const router = express.Router()
const passport = require('passport')

// error catch
const catchAsync = require('../utils/catchAsync')

// controller
const users = require('../controllers/users')

// router chaining
router.route('/register')
  .get(users.renderRegister)
  .post(catchAsync(users.createUser))

router.route('/login')
  .get(users.renderLogin)
  .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), catchAsync(users.loginUser))

router.get('/logout', users.renderLogout)

module.exports = router