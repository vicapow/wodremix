
var Workout = require('../models/workout')

module.exports = function(app){
  app.post('/wod-result/create', function(req, res, next){
    if(!req.isAuthenticated()) return res.render('login')
    var workout = JSON.parse(req.body.workout)
    workout = new Workout(workout)
    workout.save()
    res.json(workout)
  })
}