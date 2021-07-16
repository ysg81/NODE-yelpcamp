const User = require('../models/user')

module.exports.renderRegister = (req, res) => {
  res.render('users/register')
}

module.exports.createUser = async(req, res, next) => {
  try{
    const {username, email, password} = req.body
    const user = new User({username, email})
    const registeredUser = await User.register(user, password)
    req.login(registeredUser, err => {
      if(err) return next(err)
      req.flash('success', 'Welcome to Yelp Camp!')
      res.redirect('/campgrounds')
    })
  }
  catch(err){
    req.flash('error', err.message)
    res.redirect('/register')
  }
}

module.exports.renderLogin = (req,res) => {
  res.render('users/login')
}

module.exports.loginUser = async(req,res) => {
  req.flash('success', 'Welcome back!')
  res.redirect('/campgrounds')
}

module.exports.renderLogout = (req, res) => {
  req.logout();
  req.flash('success', "Goodbye!")
  res.redirect('/')
}