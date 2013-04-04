// AMRAP
module.exports = {
  // the type of score.
  type : 'reps'
  , tasks : [
    {
      type : 'run'
      , metrics : {
        distance : { value : 200, units : 'meters' }
        , direction : 'forward'
      }
    }
    , {
      type : 'chest to bar'
      , metrics : {
        reps : { value : 'max', untis : null }
      }
    }
  ]
}