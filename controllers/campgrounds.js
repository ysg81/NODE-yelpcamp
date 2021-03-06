const Campground = require('../models/campground')
const {cloudinary} = require('../cloudinary/index')

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({accessToken: mapBoxToken})

module.exports.index = async(req, res) => {
  const campgrounds = await Campground.find({})
  res.render('campgrounds/index', {campgrounds})
}

module.exports.renderNew = (req, res) => {
  res.render('campgrounds/new')
}

module.exports.createCampground = async (req, res, next) => {

  const geoDatae = await geocoder.forwardGeocode({
    query: req.body.campground.location,
    limit: 1,
  }).send()

  const newcampground = new Campground(req.body.campground)
  newcampground.geometry = geoDatae.body.features[0].geometry

  newcampground.images = req.files.map(f => ({url: f.path, filename: f.filename}))
  newcampground.author = req.user._id
  console.log(newcampground)
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
  const imgs = req.files.map(f => ({url: f.path, filename: f.filename}))
  editcampground.images.push(...imgs)
  await editcampground.save()
  console.log(req.body.deleteImages)
  if(req.body.deleteImages) {
    for(let filename of req.body.deleteImages){
      cloudinary.uploader.destroy(filename)
    }
    await editcampground.updateOne({$pull: {images: {filename : {$in: req.body.deleteImages}}}})
    console.log(editcampground)
  }

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