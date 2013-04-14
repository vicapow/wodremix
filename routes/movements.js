var Workout = require('../models/workout')
  , _ = require('underscore')
  , movements = require('../assets/data/movements')

module.exports = function(app){
  app.get('/movements', function(req, res, next){
    if(!req.isAuthenticated()) return res.redirect('/')
    return res.render('movements/index',{
      movements : movements.all()
    })
  })
  app.get('/movements/:movement', function(req, res, next){
    if(!req.isAuthenticated()) return res.redirect('/')
    var name = req.params.movement
    name = name.replace(/-/g,' ')
    var movement = movements[name]
    Workout.getRecords({
      userid : req.user._id
      , movement : name
    }, function(err, records){
      if(err) records = []
      Workout.getWith({
        userid : req.user._id
        , movement : name
      }, function(err, workouts){
        if(err) return next(err)
        workouts = _.map(workouts, function(workout){
          return workout.value
        })
        return res.render('movements/movement', {
          movement : movement
          , records : records
          , workouts : workouts
        })
      })
    })
  })
}