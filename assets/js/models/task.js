var _ = require('underscore')
var Backbone = require('backbone')
var movements = require('./../../data/movements.js')
var wodtypes = require('./../../data/wodtypes.js')
var Metrics = require('./metrics.js')
var Metric = require('./metric.js')

/**
  * a task is an item in a workout description to be performed
  */

var Task = Backbone.Model.extend({
  metrics : null
  , constructor: function(movement){
    if(typeof movement === 'string') movement = movements[movement]
    movement = _.extend({}, movement)
    var metrics = movement.metrics
    delete movement.metrics
    Backbone.Model.call(this, movement)
    this.metrics = new Metrics()
    this.setMetrics(metrics)
    this.listenTo(this, 'change:name', this.onChangeName)
  }
  , defaults : {
    "workoutType" : 'rounds'
  }
  , setMetrics : function(metrics){
    // adds a name property to each metric object that was the key on the
    // original `metrics` object but only if that metric did exist before
    var metricNames = _.keys(metrics)
    metrics = _.map(metricNames, function(metric){
      var existingMetric = this.metrics && this.metrics.findWhere({name:metric})
      if(existingMetric) return existingMetric
      return new Metric({
        name : metric
        , value : metrics[metric].value
        , units : metrics[metric].units
      })
    }, this)
    // remove the metric item if its not in the new set of metrics
    var metricsToBeRemoved = []
    this.metrics.each(function(metric){
      if(!_.contains(metrics, metric)) metricsToBeRemoved.push(metric)
    }, this)
    this.metrics.remove(metricsToBeRemoved)
    // add the new metric if its not already on the metrics collection
    _.each(metrics, function(metric){
      if(!this.metrics.contains(metric)) this.metrics.add(metric)
    }, this)
    this.__unusedMetrics = new Metrics()
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
    var order = this.get('order')
    var task = this.collection.at(i - 1)
    this.set('order', task.get('order'))
    task.set('order', order)
    this.collection.sort()
    return this
  }
  , moveDown : function(){
    if(!this.collection) return
    var i = this.collection.indexOf(this)
    if(i >= this.collection.length - 1) return
    var order = this.get('order')
    var task = this.collection.at(i + 1)
    this.set('order', task.get('order'))
    task.set('order', order)
    this.collection.sort()
    return this
  }
  // move the unused metrics to the `unusedMetrics` collection
  // also, remove any now used metrics to the `metrics` collection
  , setUnusedMetrics : function(unusedMetrics){
    var metrics = this.metrics.filter(function(metric){
      // make an expection for the `reset` movement and it's `duration` metric
      if( metric.get('name') === 'duration' 
        && this.get('name') === 'rest' 
        && _.contains(unusedMetrics, 'duration') 
      ) return false
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
  , onChangeName : function(){
    var name = this.get('name')
    var movement = movements[name]
    if(!movement) throw new Error("No movement found with name: " + name)
    this.set('label', movement.label)
    this.setMetrics(movement.metrics)
    this.set('type', movement.type)
  }
})

module.exports = Task