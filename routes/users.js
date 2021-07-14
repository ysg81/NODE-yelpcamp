const express = require('express')
const router = express.Router()
const passport = require('passport')

// error catch
const catchAsync = require('../utils/catchAsync')

// controller
const users = require('../controllers/users')

router.get('/register', users.renderRegister)
router.post('/register', catchAsync(uesrs.createUser))
router.get('/login', users.renderLogin)
router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), catchAsync(users.loginUser))
router.get('/logout', users.renderLogout)

module.exports = router