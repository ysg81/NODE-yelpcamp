const Campground = require('../models/campground')

module.exports.index = async(req, res) => {
  const campgrounds = await Campground.find({})
  res.render('campgrounds/index', {campgrounds})
}

module.exports.renderNew = (req, res) => {
  res.render('campgrounds/new')
}

module.exports.createCampground = async (req, res, next) => {
  const newcampground = new Campground(req.body.campground)
  newcampground.author = req.user._id
  await newcampground.save();

  /***** flash part *****/
  req.flash('success', 'Successfully made a campground!')
  /***** flash part *****/

  res.redirect(`/campgrounds/${newcampground._id}`)
}

module.exports.renderShow = async(req, res) => {
  const a_campground = await Campground.findById(req.params.id).populate({
    path: 'reviews',
    populate: {
      path: 'author'
    }
  }).populate('author')

  /***** flash part *****/
  if(!a_campground){
    req.flash('error', 'Cannot find that campground!')
    return res.redirect('/campgrounds')
  }
  /***** flash part *****/

  res.render('campgrounds/show', {a_campground})
}

module.exports.renderEdit = async(req, res) => {
  const {id} = req.params
  const editcampground = await Campground.findById(req.params.id)

  /***** flash part *****/
  if(!editcampground){
    req.flash('error', 'Cannot find that campground!')
    return res.redirect('/campgrounds')
  }
  /***** flash part *****/

  res.render('campgrounds/edit', {editcampground})
}

module.exports.editCampground = async(req, res, next) => {
  const {id} = req.params
  const editcampground = await Campground.findByIdAndUpdate(id, {...req.body.campground})

  /***** flash part *****/
  req.flash('success', 'Successfully updated a campground!')
  /***** flash part *****/

  res.redirect(`/campgrounds/${editcampground._id}`)

}

module.exports.deleteCampground = async(req, res) => {
  const {id} = req.params
  await Campground.findByIdAndDelete(id)

  /***** flash part *****/
  req.flash('success', 'Successfully deleted a campground!')
  /***** flash part *****/
  
  res.redirect('/campgrounds')
}