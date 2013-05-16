
var useragent = require('express-useragent')
var config = require('../config')

function isMobile(req){
  var source = req.headers['user-agent']
  return useragent.parse(source).isMobile 
    || req.headers.host.indexOf('localhost') !== -1 
    && config.allow.mobile.on.localhost;
}

function continueIfMobile(yes){
  if(typeof yes === 'undefined') yes = true
  return function(req, res, next){
    if( (!yes) ^ isMobile(req) ) return next()
    else return res.redirect('/')
  }
}

function continueIfAuth(yes){
  if(typeof yes === 'undefined') yes = true
  return function(req, res, next){
    if( (!yes) ^ req.isAuthenticated() ) return next()
    else return res.redirect('/')
  }
}

module.exports = {
  isMobile : isMobile
  , ensure : {
    auth : continueIfAuth(true)
    , mobile : continueIfMobile(true)
    , not : {
      auth : continueIfAuth(false)
      , mobile : continueIfMobile(false)
    }
  }
}