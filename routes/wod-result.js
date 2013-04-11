
var Workout = require('../models/workout')

module.exports = function(app){
  app.post('/wod-result/create', function(req, res, next){
    if(!req.isAuthenticated()) return res.render('login')
    var workout = JSON.parse(req.body.workout)
    workout = new Workout(workout)
    workout.creator = req.user._id
    workout.save()
    res.redirect('/stats')
  })
}