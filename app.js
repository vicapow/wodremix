var express = require('express')
  , app = express()
  , fs = require('fs')
  , config = require('./config')
  , lessMiddleware = require('less-middleware')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , mongoose = require('mongoose')
  , User = require('./models/user')
  , MongoStore = require('connect-mongo')(express)
  , rack = require('asset-rack')
  , browserify = require('browserify-middleware')

mongoose.connect(config.db.path)

// auto compile and bundle the jade templates at `/js/templates.js`
app.use(new rack.JadeAsset({
    url: '/js/templates.js'
    , dirname: './views'
}))

// template
app.set('view engine', 'jade')
app.set('views', __dirname + '/views')

app.locals.pretty = true

app.locals.menu = {
  "log" : "/wod/log"
  , "stats" : "/stats"
}
app.locals.moment = require('moment')
app.locals.unitAbbr = require('./assets/data/units-abbr')
app.locals.formats = {}
app.locals.formats.duration = function(d){
  var s = '', m = ''
  s = s + d._data.seconds;
  if(s.length===1) s = '0' + s
  m = m + d._data.minutes;
  if(m.length===1) m = '0' + m;
  return m + ':' + s
}

// compression is good
app.use(express.compress())

// styles

app.use(lessMiddleware({
    src: __dirname + '/assets/styles'
    , dest : __dirname + '/public/styles'
    , prefix : '/styles'
    , compress: false     // change in production
    , force: false        // change in production
    , debug: true
}))

// static files
app.use(express.static(__dirname + '/assets/flatstrap/assets'))
app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/assets'))

app.use(express.bodyParser())
app.use(express.methodOverride())

app.use(express.cookieParser())
app.use(express.session({
  secret : 'secret'
  , store: new MongoStore({
    db: mongoose.connection.db
  })
}))

// passport
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(function(username, password, done){
  User.login(username, password, function(err, user, msg){
    done(err, user, msg)
  })
}))

passport.serializeUser(function(user, done) {
  done(null, user._id)
});

passport.deserializeUser(function(_id, done) {
  User.findById(_id, done)
});

// routes
require('./routes')(app)

// exception handling
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }))

// browserify
browserify.settings.development.cache = 'yes'
app.get('/js/common.js', browserify([
  './assets/flatstrap/assets/js/bootstrap.min.js'
  , './assets/js/init'
  , './assets/components/ftlabs-fastclick/lib/fastclick'
  , './node_modules/post-to-url'
  , './assets/js/views/workout/editor'
]))
app.get('/js/bin/pages/home.js', browserify('./assets/js/pages/home.js'))

app.listen(3003)
