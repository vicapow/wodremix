var wodtypes = require('./wodtypes.js')
if(typeof _ === 'undefined' ) var _ = require('underscore')

// every movement has a fixed set of metric types but some movements
// allow for a variable number of that metric. for example, rounds for weight
// allows for a variable about of weight with each round so a `clean and jerk`
// should not contain a `weight` metric in the workout builder

var movements = require('workout-movements')

_.each(movements, function(movement, name){
  movement.name = name
})

// NOTE: array result
movements = _.sortBy(movements, function(movement){
  return movement.name
})

// NOTE: object result
movements = _.object(_.pluck(movements, 'name'), movements)


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