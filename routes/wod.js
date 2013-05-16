var Workout = require('../models/workout')
  , _ = require('underscore')
  , wodtypes = require('../assets/data/wodtypes')
  , movements = require('../assets/data/movements')

module.exports = function(app){
  app.get('/wod/log', function(req, res, next){
    if(!req.isAuthenticated()) return res.redirect('/')
    return res.render('workout/log')
  })
  app.get('/wod/pr/list', function(req, res, next){
    if(!req.isAuthenticated()) return res.redirect('/')
    Workout.getRecords({userid : req.user._id}, function(err, records){
      if(err) return next(err)
      records = _.sortBy(records, function(record){
        return - record.value.date
      })
      return res.render('wod/pr/list', { records : records })
    })
  })
  // list all the workouts for a user
  // TODO: pagination (low priority)
  app.get('/wod/list', function(req, res, next){
    if(!req.isAuthenticated()) return res.redirect('/')
    Workout.find({creator:req.user._id})
    .sort({ field: 'asc', date: -1 })
    .exec(function(err, workouts){
      if(err) return next(err)
      return res.render('wod/list', { workouts : workouts })
    })
  })
  app.get('/wod/result/remove/:id', function(req, res, next){
    if(!req.isAuthenticated()) return res.redirect('/')
    Workout.findOne({_id : req.params.id}, function(err, workout){
      if(err) return next(err)
      if(!workout) return res.redirect('/wod/list')
      var hash = workout.hash
      workout.remove()
      return res.redirect('/wod/' + hash)
    })
  })
  app.get('/wod/:hash', function(req, res, next){
    if(!req.isAuthenticated()) return res.redirect('/')
    Workout.find({hash : req.params.hash})
    .sort({ field: 'asc', date: -1 })
    .exec(function(err, workouts){
      if(err) return next(err)
      if(!workouts.length) return res.redirect('/wod/list')
      return res.render('wod/index', {
        wodtype : wodtypes[workouts[0].type]
        , workout : workouts[0]
        , workouts : workouts
      })
    })
  })
}