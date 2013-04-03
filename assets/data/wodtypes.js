if(typeof _ === 'undefined' ) var _ = require('underscore')

var wodtypes = {
  "duration" : {
    "label" : "Rounds for time"
    , "desc" : "Complete the workout as fast as possible."
    , "unused-metrics" : ["duration"]
    , "metrics" : {
      "unused" : ["duration"]
      , "required" : []
    }
  }
  , "rounds" : {
    "label" : "AMRAP"
    , "desc" : "Complete the workout with as many rounds as possible."
    , "metrics" : {
      "unused" : ["duration"]
      , "required" : []
    }
  }
  , "weight" : {
    "label" : "Rounds for weight"
    , "desc" : "Complete the workout with the heaviest weight possible."
    , "metrics" : {
      "unused" : []
      , "required" : ["weight"]
    }
  }
};

// add the movement key name as an attribute for convience
_.each(wodtypes, function(type, name){
  type.name = name
})

module.exports = wodtypes