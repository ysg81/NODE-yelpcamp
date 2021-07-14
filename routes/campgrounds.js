const express = require('express')
const router = express.Router()

// error catch
const catchAsync = require('../utils/catchAsync')

// middleware
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware')

// controllers
const campgrounds = require('../controllers/campgrounds')

router.get('/', catchAsync(campgrounds.index))
router.get('/new', isLoggedIn, campgrounds.renderNew)
router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))
router.get('/:id', catchAsync(campgrounds.renderShow))
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEdit))
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.editCampground))
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

module.exports = router