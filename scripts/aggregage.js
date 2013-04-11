var mongoose = require('mongoose')
  , Workout = require('../models/workout')
  , convert = require('../assets/data/unit-convert')

mongoose.connect(require('../config').db.path)

var o = {
 map : function(){
   
   var conversions = {
     // weight
     // from : http://www.onlineconversion.com/weight_all.htm
     "pounds" : {
       "kilograms" : 0.45359237
       , "poods" : 0.027827752761
     }
     , "kilograms" : {
       "pounds" : 2.2046226218
       , "poods" : 0.061349693252
     }
     , "poods" : {
       "kilograms" : 16.3
       , "pounds" : 35.935348736
     }
   }

   var convert = function(metric, to){
     var from = metric.units
     var value = metric.value
     if(from === to) return value
     return conversions[from][to] * value
   }
   
   if(this.type !== 'weight') return
   for(var i = 0; i < this.result.sets.length; i++){
     emit({
       label : this.tasks[i].name
       , reps : this.result.sets[i].metrics.reps.value 
    }
    , { 
      weight : convert(this.result.sets[i].metrics.weight, 'pounds')
      , workout : this._id
    })
   }
 }
 , reduce : function(k, vals){
   var max = 0
   for(var i = 0; i < vals.length; i++){
     if(vals[i] > max) max = vals[i].weight
   }
   return max
 }
 , verbose : true
}

Workout.mapReduce(o, function(err, result, stats){
  if(err) throw err
  console.log('map reduce took % ms', stats.processtime)
  console.log(result)
  mongoose.disconnect()
})