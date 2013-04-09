
var passport = require('passport')

module.exports = function(app){
  app.get('/', function(req, res, next){
    if(!req.isAuthenticated()){
      return res.render('login')
    }
    else return res.redirect('/stats')
  })
  app.post('/login', passport.authenticate('local', {
    successRedirect : '/stats'
    , failureRedirect : '/'
  }))
  
  app.get('/logout', function(req, res, next){
    req.logout()
    res.redirect('/')
  })
  
  require('./wod')(app)
  require('./wod-result')(app)
  require('./stats')(app)
}