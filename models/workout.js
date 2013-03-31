var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , _ = require('underscore')
  , TaskSchema = require('./task.schema')
  , crypto = require('crypto')

var WorkoutSchema = new Schema({
  name : String
  // date the workout is assigned for
  , date : { type : Date, default : Date.now }
  // date this record was created
  , created : { type : Date, default : Date.now }
  , type : String
  , rounds : Number
  , tasks : [TaskSchema]
  , hash : String
},{ strict: true })

WorkoutSchema.pre('save', function(next){
  var wod = {}
  wod.tasks = this.tasks
  wod.type = this.type
  wod.rounds = this.rounds ? this.rounds : 1
  var json = JSON.stringify(wod)
  var hash = crypto.createHash('md5').update(json).digest('hex')
  this.hash = hash
  next()
})

WorkoutSchema.statics.cleanTasks = function(workout){
  var tasks = workout.tasks
  _.each(tasks, function(task){
    if(task.units){
      var attrs = _.union(_.keys(task),['distance', 'weight', 'height', 'duration'])
      _.each(attrs, function(attr){
        if(typeof(task[attr]) !== 'number') return
        task[attr] = {
          units : task.units
          , value : task[attr]
        }
      })
      delete task.units
    }
    if(!task.reps) task.reps = 1
  })
  return workout
}

var Workout = module.exports = mongoose.model('Workout', WorkoutSchema)