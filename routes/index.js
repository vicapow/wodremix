
var passport = require('passport')
  , useragent = require('express-useragent');

module.exports = function(app){
  app.get('/', useragent.express(), function(req, res, next){
    if(!req.useragent.isMobile && req.headers.host.indexOf('localhost') === -1 ) 
      return res.render('not-supported')
    if(!req.isAuthenticated()) return res.render('login')
    else return res.redirect('/wod/log')
  })
  app.post('/login', passport.authenticate('local', {
    successRedirect : '/wod/log'
    , failureRedirect : '/'
  }))
  
  app.get('/logout', function(req, res, next){
    req.logout()
    res.redirect('/')
  })
  
  require('./wod')(app)
  require('./movements')(app)
  require('./wod-result')(app)
  require('./stats')(app)
}