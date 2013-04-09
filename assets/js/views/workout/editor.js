var TaskView = require('./task')
  , ResultsView  = require('./results')
  , MetricView  = require('./metric')
  , Workout = require('../../models/workout')
  , Task = require('../../models/task')
  , wodtypes = require('./../../../data/wodtypes')
  , movements = require('./../../../data/movements')
  , postToUrl = require('post-to-url')

var WorkoutEditor = Backbone.View.extend({
  className : 'workout-editor'
  , workout : null
  , template : Templates['workout/editor']
  , events : {
    'change .type' : 'onTypeInputChange'
    , 'click .add-movement' : 'onClickAddMovement'
    , 'click button.submit' : 'onSubmit'
  }
  , resultsView : null
  , metricView : null
  , taskViews : []
  , initialize : function(){
    __workout = this.workout = new Workout() // NOTE: global
    this.listenTo(this.workout.tasks, 'add', this.onTaskAdded)
    this.listenTo(this.workout.tasks, 'change:order', this.onChangeOrder)
    this.listenTo(this.workout.tasks, 'remove', this.onRemove)
    this.listenTo(this.workout,'change:reps', this.onRepCountChange)
    this.resultsView = new ResultsView({ workout : this.workout })
    this.metricView = new MetricView({ workout : this.workout })
    this.render()
    this.onRepCountChange()
  }
  , onRepCountChange : function(){
    if(this.workout.get('reps')) this.$('button.submit').show()
    else this.$('button.submit').hide()
  }
  , onClickAddMovement : function(){
    var type = this.workout.get('type')
    var movement = movements.filterForWorkout(type)[0]
    this.workout.tasks.add(new Task(movement))
  }
  , onChangeOrder : function(task){
    this.taskViews = _.sortBy(this.taskViews, function(view){
      return view.model.get('order')
    })
    _.each(this.taskViews, function(view){
      this.$('table.movements tbody').append(view.el)
    }, this)
  }
  , onRemove : function(task){
    var view = _.find(this.taskViews, function(view){
      return view.model === task
    })
    var i = this.taskViews.indexOf(view)
    this.taskViews.splice(i,1)
    view.remove()
  }
  , onTypeInputChange : function(){
    // change the model type
    var type = this.$('.type').val()
    this.workout.set('type', type)
  }
  , onTaskAdded : function(task){
    var view = new TaskView({model : task, workout : this.workout})
    this.taskViews.push(view)
    this.$('table.movements tbody').append(view.el)
    this.workout.tasks.each(function(model){
      if(model !== view.model) model.set('open', false)
    });
  }
  , onSubmit : function(){
    var workout = this.workout.toJSON()
    postToUrl('/wod-result/create', {
      workout : JSON.stringify(workout)
    }, 'POST' )
  }
  , render : function(){
    this.$el.html(this.template({
      title : 'Log A Wod'
      , wodtypes : wodtypes
    }))
    this.$('.results-container').html(this.resultsView.el)
    this.$('.metric-container').html(this.metricView.el)
  }
})

module.exports = WorkoutEditor