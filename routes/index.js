
var passport = require('passport')

module.exports = function(app){
  app.get('/', function(req, res, next){
    if(!req.isAuthenticated()){
      return res.render('login')
    }
    else return res.render('home/index')
  })
  app.post('/login', passport.authenticate('local', {
    successRedirect : '/'
    , failureRedirect : '/'
  }))
  
  require('./wod')(app)
}