if(typeof _ === 'undefined' ) var _ = require('underscore')

var wodtypes = {
  "duration" : {
    label : "Rounds for time"
    , desc : "Complete the workout as fast as possible."
    , unused : ["duration"]
    , required : []
    , metric : {
      type : "rounds"
      , value : 1
      , units : null
    }
  }
  , "rounds" : {
    label : "AMRAP"
    , desc : "Complete the workout with as many rounds as possible."
    , unused : ["duration"]
    , required : []
    , metric : {
      type : "duration"
      , value : 10
      , untis : "minutes"
    }
  }
  , "reps" : {
    label : "AMREP"
    , desc : "COmplete the workout with as many reps as possible."
    , unused : ["duration"]
    , required : []
    , metric : {
      type : "reps"
      , value : 1
      , units : null
    }
  }
  , "weight" : {
    label : "Rounds for weight"
    , desc : "Complete the workout with the heaviest weight possible."
    // movement has to have a weight metric
    , required : ["weight"]
    // but the weight metric should not be avaiable to set
    , unused : ["weight"]
    , metric : {
      type : "rounds"
      , value : 1
      , units : null
    }
  }
};

// add the movement key name as an attribute for convience
_.each(wodtypes, function(type, name){
  type.name = name
})

module.exports = wodtypes