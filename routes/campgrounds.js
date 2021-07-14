const express = require('express')
const router = express.Router()
const multer = require('multer')
const {storage} = require('../cloudinary/index')
const upload = multer({storage})

// error catch
const catchAsync = require('../utils/catchAsync')

// middleware
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware')

// controllers
const campgrounds = require('../controllers/campgrounds')


// router chaining
router.route('/')
  .get(catchAsync(campgrounds.index))
  .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))
router.get('/new', isLoggedIn, campgrounds.renderNew)

router.route('/:id')
  .get(catchAsync(campgrounds.renderShow))
  .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.editCampground))
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEdit))

module.exports = router