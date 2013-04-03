var wodtypes = require('./wodtypes.js')
if(typeof _ === 'undefined' ) var _ = require('underscore')

var movements = {
  "clean and jerk" : {
    "metrics" : ["reps", "weight"]
    , "label" : "Clean and Jerk"
    , "type" : "lifting"
    , "defaults" : {
      "weight" : { "value" : 135, "units" : "lbs" }
      , "reps" : 1
      , "duration" : { "value" : 60, "units" : "seconds" }
    }
  }
  , "double under" : {
    "metrics" : ["reps","duration"]
    , "label" : "Double Under"
    , "type" : "gymnastics"
    , "reps" : 20
    , "defaults" : { 
      "reps" : 20
      , "duration" : { "value" : 60, "units" : "seconds" }
    }
  }
  , "run" : {
    "metrics" : ["distance", "direction"]
    , "label" : "Run"
    , "type" : "monostructural"
    , "defaults" : {
      "distance" : { "value" : 100, "units" : "m" }
      , 'direction' : 'forwards'
    }
  }
  , "row" : {
    "metrics" : ["distance"]
    , "label" : "Row"
    , "type" : "monostructural"
    , "defaults" : {
      "distance" : { "value" : 100, "units" : "m" }
    }
  }
  , "box jump" : {
    "metrics" : ["height", "reps"]
    , "label" : "Box Jump"
    , "type" : "monostructural"
    , "defaults" : {
      "height" : { "value" : 24, "units" : "in" }
    }
  }
  , "toes to bar" : {
    "metrics" : ["reps"]
    , "label" : "Toe To Bar Pull Up"
    , "type" : "monostructural"
    , "default" : {
      "reps" : 20
    }
    , "parent" : "pull up"
  }
  , "pull up" : {
    "metrics" : ["reps"]
    , "label" : "Pull Up"
    , "type" : "monostructural"
    , "default" : {
      "reps" : 10
    }
  }
  , "chest to bar" : {
    "metrics" : ["reps"]
    , "label" : "Chest to Bar Pull Up"
    , "type" : "monostructural"
    , "default" : {
      "reps" : 10
    }
  }
  , "rest" : {
    "metrics" : ["duration"]
    , "label" : "Rest (timed)"
    , "type" : null
    , "default" : {
      "duration" : { "value" : 60, "units" : "seconds" }
    }
  }
}


var Movements = function(){
  // copy all the movements to this new instance
  _.each(_.keys(movements), function(name){
    movements[name].name = name
    this[name] = movements[name]
  }, this)
}

// filter movements by workout type, caching the results for future use
Movements.prototype.filterForWorkout = function(wodtype){
  if(typeof wodtype === 'string') wodtype = wodtypes[wodtype]
  if(typeof wodtype === 'undefined') return this
  var name = wodtype.name
  var filters = this.__workoutTypeFilters
  if(filters[name]) return filters[name]
  return filters[name] = _.filter(this, function(movement, name){
    var intersect = _.intersection(movement.metrics, wodtype.metrics.required)
    return intersect.length >= wodtype.metrics.required.length
  })
}

Movements.prototype.__workoutTypeFilters = {}

module.exports = new Movements()