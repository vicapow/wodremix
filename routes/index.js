
var passport = require('passport')
  , common = require('./common')
  , ensure = common.ensure

module.exports = function(app) {
  app.get('/', function(req, res, next) {
    if(req.isAuthenticated()) return res.redirect('/stats')
    if(common.isMobile(req)) return res.redirect('/login')
    else res.render('not-supported')
  })
  
  app.get('/login', ensure.mobile, ensure.not.auth, function(req, res, next){
    return res.render('login')
  })
  
   app.post('/login', function(req, res, next) {
     passport.authenticate('local', function(err, user, info) {
       if (err) return next(err)
       if (!user) return res.render('login', { error : 'invalid username or password' })
       req.logIn(user, function(err){
         if(err) return next(err)
         return res.redirect('/wod/log')
       })
     })(req, res, next)
   });
  
  // app.post('/login', passport.authenticate('local', {
  //   successRedirect : '/wod/log'
  //   , failureRedirect : '/'
  //   , failureFlash : true
  // }))
  
  app.get('/logout', function(req, res, next){
    req.logout()
    res.redirect('/')
  })
  
  require('./wod')(app)
  require('./movements')(app)
  require('./wod-result')(app)
  require('./stats')(app)
  require('./invite')(app)
}