var _ = require('underscore')
var Backbone = require('backbone')
var Metrics = require('../metrics')
var RepsResult = require('./reps')
var DurationResult = require('./duration')
var WeightResult = require('./weight')

var Result = Backbone.Model.extend({
  constructor : function(opts){
    Backbone.Model.call(this)
    this.workout = opts.workout
    this.listenTo(this, 'change:type', this.__onChangeType)
    this.listenTo(this.workout, 'change:type', this.__onWorkoutTypeChange)
    this.set('type', this.workout.get('type'))
    this.listenTo(this.workout.tasks, 'add', this.__onAddTask)
  }
  , __onWorkoutTypeChange : function(type){
    this.set('type', this.workout.get('type'))
  }
  , __onChangeType : function(){
    var type = this.get('type')
    if(type === 'duration') 
      this.set('metric', new DurationResult({workout:this.workout}))
    else if(type === 'rounds') 
      this.set('metric', new RepsResult({workout:this.workout}))
    else if(type === 'weight') 
      this.set('metric', new WeightResult({workout:this.workout}))
    else throw new Error('unknown result type ' + type)
  }
  , toJSON : function(){
    return this.get('metric').toJSON()
  }
})

module.exports = Result