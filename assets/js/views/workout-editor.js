var TaskList = require('../models/task-list.js')
  , TaskView = require('../views/task.js')
  , ResultsView  = require('../views/results.js')
  , Task = require('../models/task.js')
  , wodtypes = require('./../../data/wodtypes.js')

var WorkoutEditor = Backbone.View.extend({
  className : 'workout-editor'
  , model : new Backbone.Model()
  , collection : new TaskList()
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
    if(type === 'time' || type === 'weight') $duration.hide()
    else $duration.show()
    _.each(this.taskViews, function(view){
      view.setType(type)
    })
  }
  , addOne : function(task){
    var view = new TaskView({model: task})
    this.taskViews.push(view)
    this.$('table.movements tbody').append(view.render().el)
    this.collection.each(function(model){
      if(model !== view.model) model.set('open', false)
    });
    setTimeout(function(){
      scroll(0, $(document).height())
    })
  }
  , render : function(data){
    this.$el.html(this.template(_.extend({},data,{
      title : 'Log a wod'
    })))
    this.$('.results-container').html(this.resultsView.el)
  }
})

module.exports = WorkoutEditor