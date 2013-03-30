;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0](function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
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
},{}]},{},[1])
;