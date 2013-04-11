var Workout = require('../models/workout')
  , _ = require('underscore')

module.exports = function(app){
  app.get('/stats', function(req, res, next){
    if(!req.isAuthenticated()) return res.redirect('/')
    Workout.find({creator:req.user._id})
    .sort({ field: 'asc', date: -1 })
    .limit(5).exec(function(err, workouts){
      if(err) return next(err)
      end(workouts)
    })
    function end(workouts){
      return res.render('stats/index', {
        workouts : workouts
      })
    }
  })
}