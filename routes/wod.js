var Workout = require('../models/workout')
  , _ = require('underscore')
  , wodtypes = require('../assets/data/wodtypes')
  , movements = require('../assets/data/movements')

module.exports = function(app){
  app.get('/wod/log', function(req, res, next){
    if(!req.isAuthenticated()) return res.render('login')
    return res.render('workout/log')
  })
  app.get('/wod/pr/list', function(req, res, next){
    if(!req.isAuthenticated()) return res.render('login')
    Workout.getRecords(req.user._id, function(err, records){
      if(err) throw err
      return res.render('wod/pr/list', { records : records })
    })
  })
  // list all the workouts for a user
  // TODO: pagination (low priority)
  app.get('/wod/list', function(req, res, next){
    if(!req.isAuthenticated()) return res.render('login')
    Workout.find({creator:req.user._id})
    .sort({ field: 'asc', date: -1 })
    .exec(function(err, workouts){
      if(err) return next(err)
      return res.render('wod/list', { workouts : workouts })
    })
  })
  app.get('/wod/:hash', function(req, res, next){
    if(!req.isAuthenticated()) return res.render('login')
    Workout.find({hash : req.params.hash})
    .sort({ field: 'asc', date: -1 })
    .exec(function(err, workouts){
      if(err) return next(err)
      if(!workouts.length) return res.send(404)
      return res.render('wod/index', {
        wodtype : wodtypes[workouts[0].type]
        , workout : workouts[0]
        , workouts : workouts
      })
    })
  })
  app.get('/wod/pr/:movement', function(req, res, next){
    var name = req.params.movement
    name = name.replace(/-/g,' ')
    var movement = movements[name]
    if(!movement) return res.redirect('/')
    return res.render('wod/pr/movement', {
      movement : movement
    })
  })
}