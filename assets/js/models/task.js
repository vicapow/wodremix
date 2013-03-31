
var movements = require('./../../data/movements.js')

var Task = Backbone.Model.extend({
  defaults : function(){
    var movement = 'double under'
    return _.extend({
      open : true
      , movement : movement
    }, movements[movement])
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
  , changeMovement : function(type){
    var movement = movements[type]
    _.each(movement.metrics, function(metric){
      if(!this.get(metric)) this.set(metric, movement[metric])
    }, this)
    this.set('metrics', movement.metrics)
    this.set('label', movement.label)
    this.set('movement', type)
  }
})

module.exports = Task