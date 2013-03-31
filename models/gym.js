var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Workout = require('./workout')
  , User = require('./user')


var GymSchema = new Schema({
  name : String
})

GymSchema.methods.getTodaysWorkouts = function(cb){
  var today = new Date()
  today.setUTCHours(0,0,0,0)
  Workout.find({
    gym : this._id
    , date : { $gte : today }
  }, cb)
}

GymSchema.methods.getMembers = function(cb){
  User.find({
    gym : this._id
  }, cb)
}

GymSchema.methods.addMember = function(user, cb){
  return user.addGym(this, cb)
}

var Gym = module.exports = mongoose.model('Gym', GymSchema);