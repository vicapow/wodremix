var express = require('express')
  , app = express()
  , fs = require('fs')
  , lessMiddleware = require('less-middleware')

// template
app.set('view engine', 'jade')
app.set('views', __dirname + '/views')

// styles

app.use(lessMiddleware({
    src: __dirname + '/assets/styles'
    , dest : __dirname + '/public/styles'
    , prefix : '/styles'
    , compress: false // change in production
    , force: true // change in production
    , debug: true
}));

// static files
app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/assets/flatstrap/assets/'))

app.get('/', function(req, res){
  res.render('index');
})

app.get('*', function(req, res, next){
  fs.exists(__dirname + '/views' + req.path + '.jade', function(exists){
    if(exists) return res.render(req.path.slice(1))
    fs.exists(__dirname + '/views' + req.path + '/index.jade', function(exists){
      if(exists) return res.render(req.path.slice(1))
      return next();
    })
  })
})

app.listen(3000)