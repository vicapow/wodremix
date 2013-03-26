var express = require('express')
  , app = express()
  , fs = require('fs')
  , lessMiddleware = require('less-middleware')

// template
app.set('view engine', 'jade')
app.set('views', __dirname + '/views')

// styles

app.use(lessMiddleware({
    src: __dirname + '/styles'
    , dest : __dirname + '/public/styles'
    , prefix : '/styles'
    , compress: false // change in production
    , force: true // change in production
    , debug: true
}));

// static files
app.use(express.static(__dirname + '/public'))

app.get('/', function(req, res){
  res.render('index');
})

app.get('*', function(req, res, next){
  fs.exists(__dirname + '/views' + req.path + '.jade', function(exists){
    if(!exists) return next()
    return res.render(req.path.slice(1))
  })
})

app.listen(3000)