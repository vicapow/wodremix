var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , _ = require('underscore')
  , TaskSchema = require('./task.schema')
  , crypto = require('crypto')
  , moment = require('moment')
  , unitConvert = require('../assets/data/unit-convert')

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

/** taks a workout in the `workout.js` format and converts it to our internal
  * workout format
  * for example:
  *  { weight: 100, units : 'pounds' }
  * goes to...
  * { weight : { value : 100, units : 'pounds' } }
  */
WorkoutSchema.statics.cleanTasks = function(workout){
  var tasks = workout.tasks
  _.each(tasks, function(task){
    if(task.units){
      // remove keys that arent tasks we know about
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
    if(!task.reps) task.reps = { value : 1, units : null }
  })
  return workout
}

WorkoutSchema.methods.getRepsPerRound = function(){
  return _.reduce(this.tasks, function(memo, task){
    return memo + task.metrics.reps.value
  }, 0)
}
/**
  * getRecords([options], callback)
  * retrieve records. optionally for a given user and/or gym
  */
WorkoutSchema.statics.getRecords = function(opts, cb){
  // NOTE: map/reduce methods are run on the server, so they cannot reference
  // any variables outside of its scope without passing them to the `scope`
  // property
  if(!cb) cb = opts
  var o = {
   map : function(){
     if(this.type !== 'weight') return
     if(creator && !this.creator.equals(creator)) return
     if(gymid && !this.gym.equals(gymid)) return
     
     for(var i = 0; i < this.result.sets.length; i++){
       var set = this.result.sets[i]
       emit({
         name : this.tasks[i].name
         , reps : set.metrics.reps.value 
      }
      , { 
        __data__ : unitConvert(set.metrics.weight, 'pounds')
        , workout : this._id
        , label : set.label
        , metrics : set.metrics
        , date : this.date
        , name : this.tasks[i].name
      })
     }
   }
   , reduce : function(k, vals){
     var max = 0
     for(var i = 1; i < vals.length; i++){
       if(vals[i].__data__ > vals[max].__data__) max = i
     }
     return vals[max]
   }
   , scope : {
     creator : opts.creator
     , gymid : opts.gymid
     , unitConvert : unitConvert
   }
  }
  
  Workout.mapReduce(o, cb)
}

var Workout = module.exports = mongoose.model('Workout', WorkoutSchema)