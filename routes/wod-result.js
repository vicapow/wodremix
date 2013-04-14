
var Workout = require('../models/workout')

module.exports = function(app){
  app.post('/wod-result/create', function(req, res, next){
    if(!req.isAuthenticated()) return res.redirect('/')
    var workout = JSON.parse(req.body.workout)
    if(workout.date === 'today') 
      workout.date = new Date()
    if(workout.date === 'yesterday') 
      workout.date = new Date(new Date() - 24 * 60 * 60 * 1000)
    else workout.date = null
    workout = new Workout(workout)
    workout.creator = req.user._id
    workout.save()
    res.redirect('/stats')
  })
}