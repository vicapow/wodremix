var TaskView = require('../views/task.js')
  , ResultsView  = require('../views/results.js')
  , Task = require('../models/task.js')
  , Workout = require('../models/workout.js')
  , wodtypes = require('./../../data/wodtypes.js')

var WorkoutEditor = Backbone.View.extend({
  className : 'workout-editor'
  , model : new Workout()
  , template : Templates['workout/editor']
  , taskViews : []
  , events : {
    'change .type' : 'onTypeInputChange'
    , 'click .add-movement' : 'onClickAddMovement'
  }
  , initialize : function(data){
    this.listenTo(this.collection, 'add', this.addOne)
    this.listenTo(this.collection, 'change:order', this.onChangeOrder)
    this.listenTo(this.collection, 'remove', this.onRemove)
    this.listenTo(this.model, 'change:type', this.onChangeType)
    this.resultsView = new ResultsView({
      tasks : this.collection
      , model : this.model
    })
    this.render(data)
    this.model.set('type', 'rounds')
    this.onTypeInputChange()
  }
  , onClickAddMovement : function(){
    var self = this
    this.collection.add(new Task({
      order : self.collection.nextOrder()
      , workoutType : this.model.get('type')
    }))
    _.last(this.taskViews).$('.movement').focus()
  }
  , onChangeOrder : function(task){
    this.taskViews = _.sortBy(this.taskViews, function(view){
      return view.model.get('order')
    })
    _.each(this.taskViews, function(view){
      this.$('table.movements tbody').append(view.el)
    })
  }
  , onRemove : function(child){
    var view = _.find(this.taskViews, function(view){
      return view.model === child
    })
    var i = this.taskViews.indexOf(view)
    this.taskViews.splice(i,1)
  }
  , onTypeInputChange : function(){
    // change the model
    var type = this.$('.type').val()
    this.model.set('type', type)
  }
  , onChangeType : function(){
    // model changed its type
    var $rounds = this.$('.rounds-control')
    var type = this.model.get('type')
    if(type === 'rounds' ) $rounds.hide()
    else $rounds.show()
    var $duration = this.$('.duration-control')
    if(type === 'duration' || type === 'weight') $duration.hide()
    else $duration.show()
    var requiredMetrics = wodtypes[type].metrics.required
    // remove tasks that don't contain at minimum the required metrics 
    // for this workout type
    this.collection.remove(this.collection.filter(function(task){
      return _.intersection(
        task.get('metrics')
        , requiredMetrics
      ).length < requiredMetrics.length
    }))
    this.collection.each(function(task){
      task.set('workoutType', type)
    })
  }
  , addOne : function(task){
    var view = new TaskView({model: task})
    this.taskViews.push(view)
    this.$('table.movements tbody').append(view.render().el)
    this.collection.each(function(model){
      if(model !== view.model) model.set('open', false)
    });
  }
  , render : function(data){
    this.$el.html(this.template(_.extend({},data,{
      title : 'Log a wod'
    })))
    this.$('.results-container').html(this.resultsView.el)
  }
})

module.exports = WorkoutEditor