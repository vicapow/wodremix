
var passport = require('passport')

module.exports = function(app){
  app.get('/', function(req, res, next){
    if(!req.isAuthenticated()) return res.render('login')
    else res.redirect('/home')
  })
  app.post('/login', passport.authenticate('local', {
    successRedirect : '/home'
    , failureRedirect : '/'
  }))
  
  require('./wod')(app)
}