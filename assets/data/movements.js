var wodtypes = require('./wodtypes.js')
if(typeof _ === 'undefined' ) var _ = require('underscore')

// every movement has a fixed set of metric types but some movements
// allow for a variable number of that metric. for example, rounds for weight
// allows for a variable about of weight with each round so a `clean and jerk`
// should not contain a `weight` metric in the workout builder

var movements = {
  "clean and jerk" : {
    label : "Clean and Jerk"
    , type : "lifting"
    // the default metric values for this movement
    , metrics : {
      reps : { value : 1, units : null }
      , weight : { value : 135, units : "pounds" }
    }
  }
  , 'deadlift' : {
    label : 'Deadlift'
    , type : 'lifting'
    , metrics : {
      reps : { value : 1, units : null }
      , weight : { value : 135, units : "pounds" }
    }
  }
  , "double under" : {
    label : "Double Under"
    , type : "gymnastics"
    , metrics : { 
      reps : {
        value : 1
        , units : null
      }
    }
  }
  , "run" : {
    label : "Run"
    , type : "monostructural"
    , metrics : {
      distance : { 
        value : 100
        , units : "meters"
      }
      , direction : {
        value : "forwards"
        , units : null
      }
    }
  }
  , "row" : {
    label : "Row"
    , type : "monostructural"
    , metrics : {
      distance : { 
        value : 100
        , units : "meters"
      }
    }
  }
  , "box jump" : {
    label : "Box Jump"
    , type : "monostructural"
    , metrics : {
      height : { 
        value : 24
        , units : "inches"
      }
      , reps : {
        value : 10
        , units : null
      }
    }
  }
  , "toes to bar" : {
    label : "Toe To Bar Pull Up"
    , type : "monostructural"
    , metrics : {
      reps : {
        value : 20
        , units : null
      }
    }
    , parent : "pull up"
  }
  , "pull up" : {
    label : "Pull Up"
    , type : "monostructural"
    , metrics : {
      reps : {
        value : 20
        , units : null
      }
    }
  }
  , "chest to bar" : {
    label : "Chest to Bar Pull Up"
    , type : "monostructural"
    , metrics : {
      reps : {
        value : 10
        , units : null
      }
    }
  }
  , "rest" : {
    label : "Rest (timed)"
    , type : null
    , metrics : {
      duration : { 
        value : 60
        , units : "seconds" 
      }
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
  var type = wodtype.type
  var filters = this.__workoutTypeFilters
  if(filters[type]) return filters[type]
  return filters[type] = _.filter(this, function(movement, name){
    var intersect = _.intersection(_.keys(movement.metrics), wodtype.required)
    return intersect.length >= wodtype.required.length
  })
}

Movements.prototype.__workoutTypeFilters = {}

module.exports = new Movements()