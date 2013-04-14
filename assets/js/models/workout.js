var _ = require('underscore')
var Backbone = require('backbone')
var Tasks = require('./tasks')
var Result = require('./result/result')
var workouts = require('../../data/wodtypes')

var Workout = Backbone.Model.extend({
  constructor : function(attr){
    if(typeof attr === 'string') attr = workouts[attr]
    if(typeof attr === 'undefined') // just get the first workout type
      attr = workouts[_.chain(workouts).keys().first().value()]
    var metric = attr.metric
    Backbone.Model.call(this, attr)
    this.metric = new Backbone.Model(metric)
    this.tasks = new Tasks()
    this.unset('metric')
    this.set('reps', 0)
    this.set('date', 'today')
    this.listenTo(this.tasks, 'add', this.__onAddTask)
    this.listenTo(this.tasks, 'remove', this.__onRemoveTask)
    this.listenTo(this, 'change:unused', this.__updateUnusedMetrics)
    this.listenTo(this, 'change:type', this.__updateWorkoutFromTypeChange)
    this.listenTo(this, 'change:required', this.__removeTasksWithoutRequiredMetrics)
    this.result = new Result({workout:this})
  }
  , __onAddTask : function(task){
    if(this.__hasTaskRequiredMetrics(task)){
      task.setUnusedMetrics(this.get('unused'))
      this.listenTo(task.metrics, 'change:value', this.__onTaskMetricChange)
      this.__updateReps()
    }else this.tasks.remove(task)
  }
  , __onRemoveTask : function(task){
    this.stopListening(task.metrics)
    this.__updateReps()
  }
  , __onTaskMetricChange : function(metric){
    if(metric.get('name') === 'reps') this.__updateReps()
  }
  , __updateReps : function(){
    var num = 0
    this.tasks.each(function(task){
      var metric = task.metrics.findWhere({name:'reps'})
      if(!metric) num += 1
      else num += Number(metric.get('value'))
    }, this)
    this.set('reps', num)
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
  // updating the workout type should update other workout attributes
  , __updateWorkoutFromTypeChange : function(){
    var workout = workouts[this.get('type')]
    workout  = _.extend({}, workout) // NOTE: shallow copy
    var metric = workout.metric
    delete workout.metric
    this.set(workout)
    this.metric.set(metric)
  }
  , toJSON : function(){
    var obj = Backbone.Model.prototype.toJSON.apply(this)
    obj.tasks = this.tasks.toJSON()
    obj.metric = this.metric.toJSON()
    obj.result = this.result.toJSON()
    return obj
  }
})

module.exports = Workout