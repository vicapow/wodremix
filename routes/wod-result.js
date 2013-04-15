
var Workout = require('../models/workout')

module.exports = function(app){
  app.post('/wod-result/create', function(req, res, next){
    if(!req.isAuthenticated()) return res.redirect('/')
    var workout = JSON.parse(req.body.workout)
    var date = workout.date
    if(date === 'today') date = new Date()
    else if(date === 'yesterday') 
      date = new Date(new Date() - 24 * 60 * 60 * 1000)
    else date = null
    workout.date = date
    workout = new Workout(workout)
    workout.creator = req.user._id
    workout.save()
    res.redirect('/stats')
  })
}