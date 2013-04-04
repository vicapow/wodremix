var _ = require('underscore')
var Backbone = require('backbone')
var Tasks = require('./tasks')
var workouts = require('../../data/wodtypes')

var Workout = Backbone.Model.extend({
  constructor : function(attr){
    if(typeof attr === 'string') attr = workouts[attr]
    var metric = attr.metric
    Backbone.Model.call(this, attr)
    this.metric = new Backbone.Model(metric)
    this.tasks = new Tasks()
    this.unset('metric')
    this.listenTo(this.tasks, 'add', this.onAddTask)
    this.listenTo(this, 'change:unused', this.__updateUnusedMetrics)
    this.listenTo(this, 'change:name', this.__updateWorkoutFromNameChange)
    this.listenTo(this, 'change:required', this.__removeTasksWithoutRequiredMetrics)
  }
  , onAddTask : function(task){
    if(this.__hasTaskRequiredMetrics(task))
      task.setUnusedMetrics(this.get('unused'))
    else this.tasks.remove(task)
  }
  , __updateUnusedMetrics : function(){
    this.tasks.each(function(task){
      task.setUnusedMetrics(this.get('unused'))
    }, this)
  }
  , __hasTaskRequiredMetrics : function(task){
    var taskMetrics = task.metrics.pluck('name')
    var required = this.get('required')
    return _.intersection(taskMetrics, required).length >= required.length
  }
  , __removeTasksWithoutRequiredMetrics : function(){
    var tasksToBeRemoved = []
    this.tasks.each(function(task){
      if(!this.__hasTaskRequiredMetrics(task)) tasksToBeRemoved.push(task)
    }, this)
    this.tasks.remove(tasksToBeRemoved)
  }
  // updating the workout name (type) should update other workout attributes
  , __updateWorkoutFromNameChange : function(){
    this.set(workouts[this.get('name')])
  }
  , toJSON : function(){
    var obj = Backbone.Model.prototype.toJSON.apply(this)
    obj.tasks = this.tasks.toJSON()
    obj.metric = this.metric.toJSON()
    return obj
  }
})

module.exports = Workout