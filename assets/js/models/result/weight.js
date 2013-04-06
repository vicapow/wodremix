var Backbone = require('backbone')
var Metric = require('../metric')

var WeightRound = Backbone.Model.extend({
  defaults : {
    weight : {
      value : 0
      , units : "lbs"
    }
    , reps : {
      value : 0
      , units : null
    }
  }
  , constructor : function(opts){
    this.task = opts.task
    Backbone.Model.call(this)
    this.listenTo(this.task, 'change:order', this.__changeTaskOrder)
    this.set('order', this.task.get('order'))
  }
  , __changeTaskOrder : function(task){
    this.set('order', task.get('order'))
  }
})

var Rounds = Backbone.Collection.extend({
  model: WeightRound
  , initialize : function(){
    this.comparator = function(round){
      return round.get('order')
    }
    this.listenTo(this, 'change:order', this.sort)
  }
})


var WeightResult = Backbone.Model.extend({
  defaults : function(){
    return {
      rounds : new Rounds
    }
  }
  , initialize : function(opts){
    this.workout = opts.workout
    this.listenTo(this.workout.tasks, 'add', this.__onAddTask)
    this.listenTo(this.workout.tasks, 'remove', this.__onRemove)
    this.workout.tasks.each(function(task){
      this.__onAddTask(task)
    }, this)
  }
  , __onAddTask : function(task){
    this.get('rounds').add(new WeightRound({task:task}))
  }
  , __onRemove : function(task){
    var round = this.get('rounds').find(function(round){
      return round.task === task
    })
    this.get('rounds').remove(round)
  }
  , toJSON : function(){
    return {
      rounds : this.get('rounds').map(function(round){
        return round.toJSON()
      })
    }
  }
})



module.exports = WeightResult