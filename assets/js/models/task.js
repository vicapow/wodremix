var _ = require('underscore')
var Backbone = require('backbone')
var movements = require('./../../data/movements.js')
var wodtypes = require('./../../data/wodtypes.js')
var Metrics = require('./metrics.js')

/**
  * a task is an item in a workout description to be performed
  */

var Task = Backbone.Model.extend({
  constructor: function(attr){
    if(typeof attr === 'string') attr = movements[attr]
    Backbone.Model.apply(this, arguments)
    this.setMetrics(attr.metrics)
  }
  , defaults : {
    "workoutType" : 'rounds'
  }
  , setMetrics : function(metrics){
    // adds a name property to each metric object that was the key on the
    // original `metrics` object but only if that metric did exist before
    metrics = _.map(_.keys(metrics), function(metric){
      var existingMetric = this.metrics && this.metrics.findWhere({name:metric})
      if(existingMetric) return existingMetric
      return {
        name : metric
        , value : metrics[metric].value
        , units : metrics[metric].units
      }
    }, this)
    this.metrics = new Metrics(metrics)
    this.__unusedMetrics = new Metrics()
    this.unset('metrics')
  }
  , toJSON : function(){
    var obj = Backbone.Model.prototype.toJSON.apply(this)
    delete obj.workoutType
    obj.metrics = this.metrics.toJSON()
    return obj
  }
  , moveUp : function(){
    if(!this.collection) return
    var i = this.collection.indexOf(this)
    if(i <= 0) return
    var tmp = this.get('order')
    var other = this.collection.at(i - 1)
    this.set('order', other.get('order'))
    other.set('order', tmp)
    this.collection.sort()
  }
  , moveDown : function(){
    if(!this.collection) return
    var i = this.collection.indexOf(this)
    if(i >= this.collection.length - 1) return
    var tmp = this.get('order')
    var other = this.collection.at(i + 1)
    this.set('order', other.get('order'))
    other.set('order', tmp)
    this.collection.sort()
  }
  // move the unused metrics to the `unusedMetrics` collection
  // also, remove any now used metrics to the `metrics` collection
  , setUnusedMetrics : function(unusedMetrics){
    var metrics = this.metrics.filter(function(metric){
      // make an expection for the `reset` movement and it's `duration` metric
      if( metric.get('name') === 'duration' 
        && this.get('name') === 'rest' 
        && _.contains(unusedMetrics, 'duration') 
      ){
        return false
      }
      return _.contains(unusedMetrics, metric.get('name'))
    }, this)
    this.metrics.remove(metrics)
    this.__unusedMetrics.add(metrics)
    
    metrics = this.__unusedMetrics.filter(function(metric){
      return !_.contains(unusedMetrics, metric.get('name'))
    })
    this.metrics.add(metrics)
    this.__unusedMetrics.remove(metrics)
  }
  // change this movement to a different type. this is useful incase a 
  // user selected the wrong movement type (such as `deadlift` instead of 
  // `front squat`) but allowing the metric inputs to remain the same
  , changeType : function(type){
    var movement
    if(typeof type === 'string') movement = movements[type]
    else movement = type
    this.set('label', movement.label)
    this.set('name', movement.name)
    this.setMetrics(movement.metrics)
    this.set('type', movement.type)
  }
})

module.exports = Task