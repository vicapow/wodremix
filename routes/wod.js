var Workout = require('../models/workout')
  , _ = require('underscore')
  , wodtypes = require('../assets/data/wodtypes')
  , unitAbbr = require('../assets/data/units-abbr')

module.exports = function(app){
  app.get('/wod/log', function(req, res, next){
    if(!req.isAuthenticated()) return res.render('login')
    return res.render('workout/log')
  })
  app.get('/wod/pr', function(req, res, next){
    console.log('get wod/pr')
    if(!req.isAuthenticated()) return res.render('login')
    Workout.getRecords(req.user._id, function(err, records){
      if(err) throw err
      res.json(records)
    })
  })
  app.get('/wod/:hash', function(req, res, next){
    if(!req.isAuthenticated()) return res.render('login')
    Workout.find({hash:req.params.hash})
    .sort({ field: 'asc', date: 1 })
    .exec(function(err, workouts){
      if(err) return next(err)
      if(!workouts.length) return res.send(404)
      res.render('wod/index', {
        wodtype : wodtypes[workouts[0].type]
        , workout : workouts[0]
        , unitAbbr : unitAbbr
        , workouts : workouts
      })
    })
  })
}