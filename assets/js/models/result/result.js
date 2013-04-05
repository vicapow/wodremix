var _ = require('underscore')
var Backbone = require('backbone')
var Metrics = require('../metrics')
var RoundsResult = require('./rounds')
var DurationResult = require('./duration')
var WeightResult = require('./weight')

var Result = Backbone.Model.extend({
  initialize : function(opts){
    this.workout = opts.workout
    this.listenTo(this, 'change:type', this.__onChangeType)
    this.listenTo(this.workout, 'change:type', this.__onWorkoutTypeChange)
    this.set('type', this.workout.get('type'))
    this.listenTo(this.workout.tasks, 'add', this.__onAddTask)
  }
  , __onAddTask : function(task){
    if(!this.get('type') === 'weight') return
    this.get('metric').add({
    })
  }
  , __onWorkoutTypeChange : function(type){
    this.set('type', this.workout.get('type'))
  }
  , __onChangeType : function(){
    var type = this.get('type')
    if(type === 'duration') this.set('metric', new DurationResult())
    else if(type === 'rounds') this.set('metric', new RoundsResult())
    else if(type === 'weight') this.set('metric', new WeightResult())
    else throw new Error('unknown result type ' + type)
  }
  , toJSON : function(){
    return this.get('metric').toJSON()
  }
})

module.exports = Result