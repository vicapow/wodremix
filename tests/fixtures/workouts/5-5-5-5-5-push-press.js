// AMRAP
module.exports = {
  // the type of score.
  type : 'weight'
  , rounds : 5
  , tasks : [
    {
      type : 'push press'
      , metrics : {
        weight : { value : 'max', units : 'pounds' }
        , reps : { value : 5, units : null }
      }
    }
  ]
}