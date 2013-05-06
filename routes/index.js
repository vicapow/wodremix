
var passport = require('passport')
  , common = require('./common')

module.exports = function(app){
  app.get('/', function(req, res, next){
    if(!common.isMobile(req)) return res.render('not-supported')
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
  
  app.get('/invite', function(req, res, next){
    if(!req.isAuthenticated() && common.isMobile(req) )
      return res.render('invite')
    return res.redirect('/')
  })
  
  require('./wod')(app)
  require('./movements')(app)
  require('./wod-result')(app)
  require('./stats')(app)
}