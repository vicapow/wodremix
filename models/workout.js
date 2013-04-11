var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , _ = require('underscore')
  , TaskSchema = require('./task.schema')
  , crypto = require('crypto')
  , moment = require('moment')

var WorkoutSchema = new Schema({
  label : String
  , desc : String
  , type : String
  // date the workout is assigned for
  , date : { type : Date, default : Date.now }
  // date this record was created
  , created : { type : Date, default : Date.now }
  , type : String
  , rounds : Number
  , tasks : [TaskSchema]
  , reps : Number
  , hash : String
  , result : {
    sets : [TaskSchema]
    , duration : {
      value : Number
      , units : String // 'seconds', 'minutes' etc.
    }
    , reps : {
      value : Number
    }
  }
  // if not null, the gym that this workout is from, otherwise, indicates
  // this workout didn't come from a gym
  , gym : Schema.Types.ObjectId
  // if not null, the user that created this workout, otherwise, 
  // indicates that this workout didn't come from a user
  , creator : Schema.Types.ObjectId
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

WorkoutSchema.methods.getRepsPerRound = function(){
  return _.reduce(this.tasks, function(memo, task){
    return memo + task.metrics.reps.value
  }, 0)
}

WorkoutSchema.statics.getRecords = function(opts, cb){
  // map/reduce methods are run on the server, so they cannot reference
  // any variables outside of its scope
  var o = {
   map : function(){
     if(this.type !== 'weight') return
     if(userid && !this.creator.equals(userid)) return
     if(gymid && !this.gym.equals(gymid)) return
     var conversions = {
       // weight
       // from : http://www.onlineconversion.com/weight_all.htm
       "pounds" : {
         "kilograms" : 0.45359237
         , "poods" : 0.027827752761
       }
       , "kilograms" : {
         "pounds" : 2.2046226218
         , "poods" : 0.061349693252
       }
       , "poods" : {
         "kilograms" : 16.3
         , "pounds" : 35.935348736
       }
     }

     var convert = function(metric, to){
       var from = metric.units
       var value = metric.value
       if(from === to) return value
       return conversions[from][to] * value
     }
     
     for(var i = 0; i < this.result.sets.length; i++){
       var set = this.result.sets[i]
       emit({
         name : this.tasks[i].name
         , reps : set.metrics.reps.value 
      }
      , { 
        weight : convert(set.metrics.weight, 'pounds')
        , workout : this._id
        , label : set.label
        , units : set.metrics.weight.units
      })
     }
   }
   , reduce : function(k, vals){
     var max = 0
     for(var i = 0; i < vals.length; i++){
       if(vals[i] > max) max = vals[i].weight
     }
     return max
   }
   , scope : {
     userid : opts.userid
     , gymid : opts.gymid
   }
  }
  
  Workout.mapReduce(o, cb)
}

var Workout = module.exports = mongoose.model('Workout', WorkoutSchema)