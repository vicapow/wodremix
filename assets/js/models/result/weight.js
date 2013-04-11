var Backbone = require('backbone')
var _ = require('underscore')
var Metric = require('../metric')
var movements = require('../../../data/movements')
var deepcopy = require('deepcopy')

var WeightSet = Backbone.Model.extend({
  defaults : {
    weight : { value : 0, units : "lbs" }
    , reps : { value : 0, units : null }
    , label : ''
  }
  , constructor : function(opts){
    this.task = opts.task
    Backbone.Model.call(this)
    this.listenTo(this.task, 'change:order', this.__changeTaskOrder)
    this.listenTo(this.task, 'change:label', this.__changeLabel)
    var repsMetric = this.task.metrics.findWhere({name:'reps'})
    this.listenTo(repsMetric, 'change:value', this.__onChangeReps)
    this.set('order', this.task.get('order'))
    this.get('reps').value = repsMetric.get('value')
    this.set('label', this.task.get('label'))
    // set the sets default metrics to that of the movements
    var attr = _.extend(
      deepcopy(movements[this.task.get('name')].metrics)
      , this.task.metrics.toJSON())
    this.set(attr)
  }
  , __changeLabel : function(task){
    this.set('label', task.get('label'))
  }
  , __changeTaskOrder : function(task){
    this.set('order', task.get('order'))
  }
  , __onChangeReps : function(metric){
    this.get('reps').value = metric.get('value')
  }
  , toJSON : function(){
    return {
      label : this.get('label')
      , metrics : {
        weight : this.get('weight')
        , reps : this.get('reps')
      }
      , order : this.get('order')
    }
  }
})

var WeightSets = Backbone.Collection.extend({
  model: WeightSet
  , initialize : function(){
    this.comparator = function(set){
      return set.get('order')
    }
    this.listenTo(this, 'change:order', this.sort)
  }
})


var WeightResult = Backbone.Model.extend({
  defaults : function(){
    return {
      sets : new WeightSets
    }
  }
  , constructor : function(opts){
    Backbone.Model.call(this)
    this.workout = opts.workout
    this.listenTo(this.workout.tasks, 'add', this.__onAddTask)
    this.listenTo(this.workout.tasks, 'remove', this.__onRemove)
    this.workout.tasks.each(function(task){
      this.__onAddTask(task)
    }, this)
  }
  , __onAddTask : function(task){
    this.get('sets').add(new WeightSet({task:task}))
  }
  , __onRemove : function(task){
    var set = this.get('sets').find(function(set){
      return set.task === task
    })
    this.get('sets').remove(set)
  }
  , toJSON : function(){
    return {
      sets : this.get('sets').map(function(set){
        return set.toJSON()
      })
    }
  }
})



module.exports = WeightResult