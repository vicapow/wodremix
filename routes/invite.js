var _ = require('underscore')
  , Invite = require('../models/invite')
  , User = require('../models/user')
  , common = require('./common')
  , ensure = common.ensure

module.exports = function(app){
  var access = [ ensure.mobile, ensure.not.auth ]
  
  app.get('/invite/accept/:code', access, function(req, res, next){
    var code = req.params.code
    return res.render('invite')
    Invite.valid(code, function(err, valid){
      if(err) return next(err)
      if(!valid) return res.redirect('/')
      return res.render('invite')
    })
  })
  app.post('/invite/accept/:code', access, function(req, res, next){
    var code = req.params.code
    var username = req.body.username
    var password = req.body.password
    var passwordAgain = req.body['password-again']
    if(!username) return done('username is required')
    if(username.length < 3) return done('username must be at least 3 characters')
    if(!password) return done('password is required')
    if(password.length < 6) 
      return done('password has to be at least 8 characters')
    if(password !== passwordAgain) return done('passwords do not match')
    User.isUsernameTaken(username, function(err, taken){
      if(err) return next(err)
      if(taken) return done('That username is already taken')
      var user = new User({
        username : username
      }).setPassword(password)
      user.save(function(err){
        if(err) return next(err)
        req.login(user, function(err){
          if(err) return next(err)
          return res.redirect('/')
        })
      })
    })
    function done(error){
      return res.render('invite', _.extend({}, req.body, { error : error }))
    }
  })
}