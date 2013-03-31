var TaskList = require('../models/task-list.js')
  , TaskView = require('../views/task.js')
  , Task = require('../models/task.js')
  , wodtypes = require('./../../data/wodtypes.js')

var WorkoutEditor = Backbone.View.extend({
  className : 'workout-editor'
  , model : new Backbone.Model()
  , collection : new TaskList()
  , template : Templates['workout/editor']
  , taskViews : []
  , events : {
    'change .type' : 'onChangeType'
    , 'click .add-movement' : 'onClickAddMovement'
  }
  , initialize : function(data){
    this.render(data)
    this.listenTo(this.collection, 'add', this.addOne)
    this.listenTo(this.collection, 'change:order', this.onChangeOrder)
    this.listenTo(this.collection, 'remove', this.onRemove)
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
      this.$('table tbody').append(view.el)
    })
  }
  , onRemove : function(child){
    var view = _.find(this.taskViews, function(view){
      return view.model === child
    })
    var i = this.taskViews.indexOf(view)
    this.taskViews.splice(i,1)
  }
  , onChangeType : function(){
    // change the model
    var type = this.$('.type').val()
    this.model.set(wodtypes[type])
  }
  , changeType : function(){
    // model changed its type
    var $rounds = this.$('.rounds-control')
    if(this.model.get('type') === 'rounds' )
      $rounds.hide()
    else $rounds.show()
  }
  , addOne : function(task){
    var view = new TaskView({model: task})
    this.taskViews.push(view)
    this.$('table tbody').append(view.render().el)
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
  }
})

module.exports = WorkoutEditor