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
    url: '/js/templates.js',
    dirname: './views'
}))

// template
app.set('view engine', 'jade')
app.set('views', __dirname + '/views')

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

require('./routes')(app)

app.use(express.errorHandler({ dumpExceptions: true, showStack: true }))

// browserify
// cache the content only for the server since we have node-inspector running
// TODO: debug how this is effecting middleware
browserify.settings.development.cache = 'yes'
app.get('/js/bin/common.js', browserify([
  './assets/js/jquery/jquery-1.9.1.js'
  , './assets/flatstrap/assets/js/bootstrap.js'
  , './assets/js/underscore/underscore.js'
  , './assets/js/backbone/backbone.js'
  , './assets/js/init.js'
  , './assets/components/ftlabs-fastclick/lib/fastclick.js'
]))
app.get('/js/bin/pages/wod.js', browserify('./assets/js/pages/wod.js'))
app.get('/js/bin/pages/home.js', browserify('./assets/js/pages/home.js'))


// app.get('*', function(req, res, next){
//   fs.exists(__dirname + '/views' + req.path + '.jade', function(exists){
//     if(exists) return res.render(req.path.slice(1))
//     fs.exists(__dirname + '/views' + req.path + '/index.jade', function(exists){
//       if(exists) return res.render(req.path.slice(1))
//       return next();
//     })
//   })
// })

app.listen(3000)