var Workout = require('../models/workout')
  , _ = require('underscore')

module.exports = function(app){
  app.get('/stats', function(req, res, next){
    if(!req.isAuthenticated()) return res.redirect('/')
    Workout.find({creator : req.user._id, date : { $ne : null } })
    .sort({ field: 'asc', date: -1 })
    .limit(5).exec(function(err, workouts){
      if(err) return next(err)
      Workout.getRecords({creator: req.user._id}, function(err, records){
        if(err) records = []
        return res.render('stats/index', {
          workouts : workouts
          , records : records
        })
      })
    })
  })
}