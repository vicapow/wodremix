
var movements = require('./../../data/movements.js')
var wodtypes = require('./../../data/wodtypes.js')

var Task = Backbone.Model.extend({
  constructor: function(attr){
    // find the first movement that supports this workout type metric
    var name = null
    var defaultMovement = _.find(movements, function(movement, key){
      name = key
      var workout = wodtypes[attr.workoutType]
      return _.intersection(workout.metrics.required
        , movement.metrics).length >= workout.metrics.required.length
    })
    
    // copy over default metric values from workout movement
    attr = _.extend({}, defaultMovement, attr)
    _.each(defaultMovement.defaults, function(_default, name){
      if(typeof m !== 'object') return attr[name] = _default
      attr[name] = _.extend({}, _default)
    })
    _.extend(attr, {
      open : true
      , movement : name
    })
    Backbone.Model.call(this, attr);
  }
  , moveUp : function(){
    var i = this.collection.indexOf(this)
    if(i <= 0) return
    var tmp = this.get('order')
    var other = this.collection.at(i - 1)
    this.set('order', other.get('order'))
    other.set('order', tmp)
    this.collection.sort()
  }
  , moveDown : function(){
    var i = this.collection.indexOf(this)
    if(i >= this.collection.length - 1) return
    var tmp = this.get('order')
    var other = this.collection.at(i + 1)
    this.set('order', other.get('order'))
    other.set('order', tmp)
    this.collection.sort()
  }
  // change this movement to a different type. this is useful incase a 
  // use selected the wrong movement type (such as `deadlift` instead of 
  // `front squat`) but allowing the metric inputs to remain the same
  , changeMovement : function(type){
    var movement = movements[type]
    console.log(type)
    _.each(movement.metrics, function(metric){
      if(!this.get(metric)) this.set(metric, movement.defaults[metric])
    }, this)
    this.set('label', movement.label)
    this.set('movement', type)
    this.set('metrics', movement.metrics)
  }
})

module.exports = Task