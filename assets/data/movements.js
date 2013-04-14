var wodtypes = require('./wodtypes.js')
if(typeof _ === 'undefined' ) var _ = require('underscore')

// every movement has a fixed set of metric types but some movements
// allow for a variable number of that metric. for example, rounds for weight
// allows for a variable about of weight with each round so a `clean and jerk`
// should not contain a `weight` metric in the workout builder

var movements = {
  'clean and jerk' : {
    label : 'Clean and Jerk'
    , type : 'lifting'
    // the default metric values for this movement
    , metrics : {
      reps : { value : 1, units : null }
      , weight : { value : 135, units : 'pounds' }
    }
    , videoId : 'yFSBGIPMa9A'
  }
  , 'front squat' : {
    label : 'Front Squat'
    , type : 'lifting'
    , metrics : {
      reps : { value : 1, units : null }
      , weight : { value : 135, units : 'pounds' }
    }
    , videoId : 'JAG8iY6InbY'
  }
  , 'back squat' : {
    label : 'Back Squat'
    , type : 'lifting'
    , metrics : {
      reps : { value : 1, units : null }
      , weight : { value : 135, units : 'pounds' }
    }
    , videoId : 'TZeqWn8CpW4'
  }
  , 'deadlift' : {
    label : 'Deadlift'
    , type : 'lifting'
    , metrics : {
      reps : { value : 1, units : null }
      , weight : { value : 135, units : 'pounds' }
    }
    , videoId : 'pjBI9qxibTc'
  }
  , 'stiff leg deadlift' : {
    label : 'Stiff Legged Deadlift'
    , type : 'lifting'
    , metrics : {
      reps : { value : 1, units : null }
      , weight : { value : 135, units : 'pounds' }
    }
    , videoId : 'SqoJ9jNjM8E'
  }
  , 'sumo deadlift high pull' : {
    label : 'Sumo Deadlift High Pull'
    , type : 'lifting'
    , metrics : {
      reps : { value : 1, units : null }
      , weight : { value : 135, units : 'pounds' }
    }
    , videoId : 'MTafqGjSeXk'
  }
  , 'thrusters' : {
    label : 'Thruster'
    , type : 'lifting'
    , metrics : {
      reps : { value : 1, units : null }
      , weight : { value : 135, units : 'pounds' }
    }
    , videoId : 'VL2B_1yD47U'
  }
  , 'bench press' : {
    label : 'Bench Press'
    , type : 'lifting'
    , metrics : {
      reps : { value : 1, units : null }
      , weight : { value : 135, units : 'pounds' }
    }
    , videoId : 'FgVDxCxXkmc'
  }
  , 'kettle bell swing' : {
    label : 'Kettle Bell Swing'
    , type : 'lifting'
    , metrics : {
      reps : { value : 20, units : null }
      , weight : { value : 1.5, units : 'poods' }
    }
    , videoId : '0dvov7IHvL0'
  }
  , 'push jerk' : {
    label : 'Push Jerk'
    , type : 'lifting'
    , metrics : {
      reps : { value : 20, units : null }
      , weight : { value : 135, units : 'pounds' }
    }
    , videoId : 'wt0qF-k9is8'
  }
  , 'jerk' : {
    label : 'Jerk'
    , type : 'lifting'
    , metrics : {
      reps : { value : 20, units : null }
      , weight : { value : 135, units : 'pounds' }
    }
    , videoId : 'bSZc1Slk6rI'
  }
  , 'push press' : {
    label : 'Push Press'
    , type : 'lifting'
    , metrics : {
      reps : { value : 20, units : null }
      , weight : { value : 135, units : 'pounds' }
    }
    , videoId : 'g0gEsMc1JZ4'
  }
  , 'snatch' : {
    label : 'Snatch'
    , type : 'lifting'
    , metrics : {
      reps : { value : 20, units : null }
      , weight : { value : 135, units : 'pounds' }
    }
    , videoId : 'gHIMIgrMEaQ'
  }
  , 'power snatch' : {
    label : 'Power Snatch'
    , type : 'lifting'
    , metrics : {
      reps : { value : 20, units : null }
      , weight : { value : 135, units : 'pounds' }
    }
    , videoId : '7h4r8tWGAKM'
    , parent : 'snatch'
  }
  , 'dumbbell snatch' : {
    label : 'Dumbbell Snatch'
    , type : 'lifting'
    , metrics : {
      reps : { value : 20, units : null }
      , weight : { value : 40, units : 'pounds' }
    }
    , videoId : 'dDRiPLPzUVg'
  }
  , 'dumbbell hang split snatch' : {
    label : 'Dumbbell Hang Split Snatch'
    , type : 'lifting'
    , metrics : {
      reps : { value : 20, units : null }
      , weight : { value : 40, units : 'pounds' }
    }
    , videoId : 'C28PXuGenbY'
  }
  , 'double under' : {
    label : 'Double Under'
    , type : 'gymnastic'
    , metrics : { 
      reps : { value : 20, units : null }
    }
    , videoId : 'Ix8TbKyvJcw'
  }
  , 'run' : {
    label : 'Run'
    , type : 'gymnastic'
    , metrics : {
      distance : { value : 100, units : 'meters' }
    }
  }
  , 'run with sandbag' : {
    label : 'Run with Sandbag'
    , type : 'gymnastic'
    , metrics : {
      distance : { value : 100, units : 'meters' }
      , weight : { value : 50, units : 'pounds' }
    }
  }
  , 'run backward' : {
    label : 'Run Backward'
    , type : 'gymnastic'
    , metrics : {
      distance : { value : 100, units : 'meters' }
    }
    , parent : 'run'
  }
  , 'farmer carry' : {
    label : 'Farmer Carry'
    , type : 'gymnastic'
    , metrics : {
      distance : { value : 10, units : 'meters' }
      , weight : { value : 135, units : 'pounds' }
    }
    , videoId : 'jQ-r8bbPhdA'
  }
  , 'row' : {
    label : 'Row'
    , type : 'gymnastic'
    , metrics : {
      distance : { value : 100, units : 'meters' }
    }
    , videoId : 'ceM4HHukhE'
  }
  , 'box jump' : {
    label : 'Box Jump'
    , type : 'gymnastic'
    , metrics : {
      height : { value : 24, units : 'inches' }
      , reps : { value : 10, units : null }
    }
    , videoId : 'IxrzCG_7FH4'
  }
  , 'wall ball shot' : {
    label : 'Wall-Ball Shot'
    , type : 'gymnastic'
    , metrics : {
      reps : { value : 10, units : null }
      , height : { value : 10, units : 'feet' }
      , weight : { value : 20, units : 'pounds' }
    }
    , videoId : 'zeaHC3CNBrA'
  }
  , 'toes to bar' : {
    label : 'Toe To Bar Pull Up'
    , type : 'gymnastic'
    , metrics : {
      reps : { value : 20, units : null }
    }
    , parent : 'pull up'
    , videoId : '29jvHSugMoE'
  }
  , 'knees to elbows' : {
    label : 'Knees to Elbows'
    , type : 'gymnastic'
    , metrics : {
      reps : { value : 20, units : null }
    }
    , parent : 'pull up'
    , videoId : 'kqOgtFcqWbE'
  }
  , 'l pull up' : {
    label : 'L Pull Up'
    , type : 'gymnastic'
    , metrics : {
      reps : { value : 20, units : null }
    }
    , parent : 'pull up'
    , videoId : '9GrD4vMs1J4'
  }
  , 'pull up' : {
    label : 'Pull Up'
    , type : 'gymnastic'
    , metrics : {
      reps : { value : 20, units : null }
    }
    , videoId : 'ifOBltCCRZw'
  }
  , 'strict pull up' : {
    label : 'Strict Pull Up'
    , type : 'gymnastic'
    , metrics : {
      reps : { value : 20, units : null }
    }
    , videoId : 'ifOBltCCRZw'
    , parent : 'pull up'
  }
  , 'muscle up' : {
    label : 'Muscle Up'
    , type : 'gymnastic'
    , metrics : {
      reps : { value : 20, units : null }
    }
    , videoId : 'FKcnpJSAsbo'
  }
  , 'sit up' : {
    label : 'Sit Up'
    , type : 'gymnastic'
    , metrics : {
      reps : { value : 20, units : null }
    }
    , videoId : 'BfqRSCgXiVw'
  }
  , 'ghd sit up' : {
    label : 'GHD Sit Up'
    , type : 'gymnastic'
    , metrics : {
      reps : { value : 20, units : null }
    }
    , videoId : 't9kra8Mg_bE'
    , parent : 'sit up'
  }
  , 'back extension' : {
    label : 'Back Extension'
    , type : 'gymnastic'
    , metrics : {
      reps : { value : 20, units : null }
    }
    , videoId : 'WHiyjsueBlM'
  }
  , 'squat' : {
    label : 'Squat'
    , type : 'gymnastic'
    , metrics : {
      reps : { value : 20, units : null }
    }
    , videoId : 'rpE5oP7lh6U'
  }
  , 'overhead squat' : {
    label : 'Overhead Squat'
    , type : 'lifting'
    , metrics : {
      reps : { value : 20, units : null }
      , weight : { value : 95, units : 'pounds' }
    }
    , videoId : 'S21wtEVDvEU'
  }
  , 'chest to bar' : {
    label : 'Chest to Bar Pull Up'
    , type : 'gymnastic'
    , metrics : {
      reps : { value : 20, units : null }
    }
    , videoId : 'h6nqLyxgiYw'
  }
  , 'push up' : {
    label : 'Push Up'
    , type : 'gymnastic'
    , metrics : {
      reps : { value : 20, units : null }
    }
    , videoId : 'M1IfJmVjKW0'
  }
  , 'parallette handstand push up' : {
    label : 'Parallette Handstand Push Up'
    , type : 'gymnastic'
    , metrics : {
      reps : { value : 5, units : null }
    }
    , videoId : 'xK8Bj2teHng'
  }
  , 'ring push up' : {
    label : 'Ring Push Up'
    , type : 'gymnastic'
    , metrics : {
      reps : { value : 20, units : null }
    }
    , videoId : '_ATX_OLs1qY'
    , parent : 'push up'
  }
  , 'hand release push up' : {
    label : 'Hand Release Push Up'
    , type : 'gymnastic'
    , metrics : {
      reps : { value : 20, units : null }
    }
    , videoId : 'hfaUWLlhvKk'
  }
  , 'handstand push up' : {
    label : 'Handstand Push up'
    , type : 'gymnastic'
    , metrics : {
      reps : { value : 20, units : null }
    }
    , videoId : 'ev2xU4gEJ3I'
    , parent : 'push up'
  }
  , 'ring handstand push up' : {
    label : 'Ring Handstand Push Up'
    , type : 'gymnastic'
    , metrics : {
      reps : { value : 20, units : null }
    }
    , videoId : 'vfmwmMTuTHc'
    , parent : 'handstand push up'
  }
  , 'pistol squat' : {
    label : 'Pistol Squat'
    , type : 'gymnastic'
    , metrics : {
      reps : { value : 20, units : null }
    }
    , videoId : 'W8rg81C7gf4'
    , parent : 'squat'
  }
  , 'clean' : {
    label : 'Clean'
    , type : 'lifting'
    , metrics : {
      reps : { value : 20, units : null }
      , weight : { value : 135, units : 'pounds' }
    }
    , videoId : '46cCnuFPG8w'
  }
  , 'dumbbell split clean' : {
    label : 'Dumbbell Split Clean'
    , type : 'lifting'
    , metrics : {
      reps : { value : 20, units : null }
      , weight : { value : 40, units : 'pounds' }
    }
    , videoId : '52Xai_rYsQI'
  } 
  , 'dumbbell squat clean' : {
    label : 'Dumbbell Squat Clean'
    , type : 'lifting'
    , metrics : {
      reps : { value : 20, units : null }
      , weight : { value : 50, units : 'pounds' }
    }
    , videoId : 'RT_MTXaLKxU'
  }
  , 'hang squat clean' : {
    label : 'Hang Squat Clean'
    , type : 'lifting'
    , metrics : {
      reps : { value : 1, units : null }
      , weight : { value : 135, units : 'pounds' }
    }
    , videoId : 'Z1zna8ONc3I'
  }
  , 'squat clean' : {
    label : 'Squat Clean'
    , type : 'lifting'
    , metrics : {
      reps : { value : 1, units : null }
      , weight : { value : 135, units : 'pounds' }
    }
    , videoId : 'G1pQ_1rgLls'
  }
  , 'dumbbell hang squat clean' : {
    label : 'Dumbbell Hang Squat Clean'
    , type : 'lifting'
    , metrics : {
      reps : { value : 20, units : null }
      , weight : { value : 35, units : 'pounds' }
    }
    , videoId : 'HCooqTAJSQc'
  }
  , 'power clean' : {
    label : 'Power Clean'
    , type : 'lifting'
    , metrics : {
      reps : { value : 20, units : null }
      , weight : { value : 135, units : 'pounds' }
    }
    , videoId : '46cCnuFPG8w'
    , parent : 'clean'
  }
  , 'hang power clean' : {
    label : 'Hang Power Clean'
    , type : 'lifting'
    , metrics : {
      reps : { value : 20, units : null }
      , weight : { value : 135, units : 'pounds' }
    }
    , videoId : 'bzQJB9XHd5c'
    , parent : 'clean'
  }
  , 'medicine ball clean' : {
    label : 'Medicine Ball Clean'
    , type : 'gymnastic'
    , metrics : {
      reps : { value : 20, units : null }
      , weight : { value : 20, units : 'pounds' }
    }
    , videoId : 'ON5l7xDUVns'
  }
  , 'ring dip' : {
    label : 'Ring Dip'
    , type : 'gymnastic'
    , metrics : {
      reps : { value : 20, units : null }
    }
    , videoId : 'afnEmGzx0Oc'
  }
  , 'burpee' : {
    label : 'Burpee'
    , type : 'gymnastic'
    , metrics : {
      reps : { value : 20, units : null }
    }
    , videoId : '7MGljX4bbps'
  }
  , 'burpee pull up' : {
    label : 'Burpee Pull Up'
    , type : 'gymnastic'
    , metrics : {
      reps : { value : 20, units : null }
    }
    , videoId : 'Mw59FFAZ0yo'
  }
  , 'rest' : {
    label : 'Rest (timed)'
    , type : null
    , metrics : {
      duration : {  value : 60, units : 'seconds' }
    }
  }
  , 'rope climb' : {
    label : 'Rope Climb'
    , type : 'gymnastic'
    , metrics : {
      reps : { value : 1, units : null }
      , height : { value : 15, units : 'feet' }
    }
    , videoId : 'eFVOKGCZHp8'
  }
  , 'overhead walk' : {
    label : 'Overhead Walk'
    , type : 'gymnastic'
    , metrics : {
      distance : { value : 25, units : 'yards' }
      , weight : { value : 135, units : 'pounds' }
    }
    , videoId : 'LrA1ACkuAc8'
  }
  , 'turkish get up' : {
    label : 'Turkish Get Up'
    , type : 'gymnastic'
    , metrics : {
      reps : { value : 20, units : null }
      , weight : { value : 2, units : 'pood' }
    }
  }
  , 'bear crawl' : {
    label : 'Bear Crawl'
    , type : 'gymnastic'
    , metrics : {
      distance : { value : 100, units : 'feet' }
    }
  }
  , 'standing broad jump' : {
    label : 'Bear Crawl'
    , type : 'gymnastic'
    , metrics : {
      distance : { value : 100, units : 'feet' }
    }
    , videoId : 'IjZ7qRyZmXQ'
  }
  , 'overhead walking lunge' : {
    label : 'Overhead Walking Lunge'
    , type : 'gymnastic'
    , metrics : {
      distance : { value : 100, units : 'feet' }
      , weight : { value : 45, units : 'pounds' }
    }
    , videoId : '6SAdh7sStRw'
  }
  , 'lowers from inverted hang' : {
    label : 'Lowers From Interted Hang'
    , type : 'gymnastic'
    , metrics : {
      reps : { value : 20, units : null }
    }
    , videoId : '04cSkfax3sE'
  }
  , 'ring row' : {
    label : 'Ring Row'
    , type : 'gymnastic'
    , metrics : {
      reps : { value : 20, units : null }
    }
    , videoId : 'LdmS3EsYtmM'
  }
}

_.each(movements, function(movement, name){
  movement.name = name
})


var Movements = function(){
  // copy all the movements to this new instance
  _.each(_.keys(movements), function(name){
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

Movements.prototype.all = function(){
  return movements
}

Movements.prototype.__workoutTypeFilters = {}

module.exports = new Movements()