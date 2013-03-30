module.exports = {
  "clean and jerk" : {
    "metrics" : ["reps", "weight"]
    , "label" : "Clean and Jerk"
    , "type" : "lifting"
    , "reps" : 1
    , "weight" : {
      "value" : 135
      , "units" : "lbs"
    }
  }
  , "double under" : {
    "metrics" : ["reps"]
    , "label" : "Double Under"
    , "type" : "gymnastics"
    , "reps" : 20
  }
  , "run" : {
    "metrics" : ["distance", "direction"]
    , "label" : "Run"
    , "type" : "monostructural"
    , "distance" : {
      "units" : "m"
      , "value" : 100
    }
    , 'direction' : 'forwards'
  }
  , "row" : {
    "metrics" : ["distance"]
    , "label" : "Row"
    , "type" : "monostructural"
    , "distance" : {
      "units" : "m"
      , "value" : 100
    }
  }
  , "box jump" : {
    "metrics" : ["height", "reps"]
    , "label" : "Box Jump"
    , "type" : "monostructural"
    , "height" : {
      "units" : "in"
      , "value" : 24
    }
  }
  , "toes to bar" : {
    "metrics" : ["reps"]
    , "label" : "Toes To Bar"
    , "type" : "monostructural"
  }
}