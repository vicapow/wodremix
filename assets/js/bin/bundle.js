;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0](function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
module.exports = {
  "clean and jerk" : {
    "metrics" : ["reps", "weight"]
    , "label" : "Clean and Jerk"
    , "type" : "lifting"
    , "reps" : 1
    , "weight" : {
      "value" : 135
      , "units" : "lbs"
    }
  }
  , "double under" : {
    "metrics" : ["reps"]
    , "label" : "Double Under"
    , "type" : "gymnastics"
    , "reps" : 20
  }
  , "run" : {
    "metrics" : ["distance", "direction"]
    , "label" : "Run"
    , "type" : "monostructural"
    , "distance" : {
      "units" : "m"
      , "value" : 100
    }
    , 'direction' : 'forwards'
  }
  , "row" : {
    "metrics" : ["distance"]
    , "label" : "Row"
    , "type" : "monostructural"
    , "distance" : {
      "units" : "m"
      , "value" : 100
    }
  }
  , "box jump" : {
    "metrics" : ["height", "reps"]
    , "label" : "Box Jump"
    , "type" : "monostructural"
    , "height" : {
      "units" : "in"
      , "value" : 24
    }
  }
  , "toes to bar" : {
    "metrics" : ["reps"]
    , "label" : "Toes To Bar"
    , "type" : "monostructural"
  }
}
},{}],2:[function(require,module,exports){

var wodtypes = {
  "time" : {
    "label" : "Rounds for time"
    , "desc" : "Complete the workout as fast as possible."
  }
  , "rounds" : {
    "label" : "AMRAP"
    , "desc" : "Complete the workout with as many rounds as possible."
  }
  , "weight" : {
    "label" : "Rounds for weight"
    , "desc" : "Complete the workout finishing with the heaviest weight possible."
  }
};

var movements = require('./../../data/movements.js')

var units = {
  "weight" : ["lbs","poods","kg"]
  , "distance" : ["m","ft","miles","km"]
  , "height" : ["m","ft","in","cm"]
}

// models

var Task = Backbone.Model.extend({
  defaults : function(){
    var movement = 'double under'
    return _.extend({
      open : true
      , movement : movement
    }, movements[movement])
  }
  , moveUp : function(){
    var i = this.collection.indexOf(this)
    if(i <= 0) return
    var tmp = this.get('order')
    var other = this.collection.at(i - 1)
    this.set('order', other.get('order'))
    other.set('order', tmp)
    this.collection.sort()
  }
  , moveDown : function(){
    var i = this.collection.indexOf(this)
    if(i >= this.collection.length - 1) return
    var tmp = this.get('order')
    var other = this.collection.at(i + 1)
    this.set('order', other.get('order'))
    other.set('order', tmp)
    this.collection.sort()
  }
  , changeMovement : function(type){
    var movement = movements[type]
    _.each(movement.metrics, function(metric){
      if(!this.get(metric)) this.set(metric, movement[metric])
    }, this)
    this.set('metrics', movement.metrics)
    this.set('label', movement.label)
    this.set('movement', type)
  }
})

var TaskList = Backbone.Collection.extend({
  model: Task
  , nextOrder : function() {
    if (!this.length) return 1;
    return this.last().get('order') + 1;
  }
  , comparator: function(task){
    return task.get('order')
  }
})

// views

var TaskView = Backbone.View.extend({
  tagName : 'tr'
  , templateOpen : Templates['workout/editor/task-open']
  , templateClosed : Templates['workout/editor/task-closed']
  , events : {
    'click .move-up'          : 'onClickUp'
    , 'click .move-down'      : 'onClickDown'
    , 'click .btn-remove'     : 'onClickRemove'
    , 'change .movement'      : 'onChangeMovement'
    , 'click .btn-done'       : 'onClickDone'
    , 'click'                 : 'onClick'
    , 'click button.units'    : 'onClickUnits'
    , 'change .metric input'  : 'onChangeMetricInput'
  }
  , initialize : function(){
    this.listenTo(this.model, 'change:open', this.render)
    this.listenTo(this.model, 'change:metrics', this.onChangeMetric)
    this.listenTo(this.model, 'remove', this.remove)
  }
  , onClickUp : function(e){
    var model = this.model
    var collection = model.collection
    model.moveUp()
    model.collection.sort()
    var orders = collection.map(function(m){
      return m.get('order')
    })
    return false
  }
  , onClickDown : function(e){
    this.model.moveDown()
    return false
  }
  , onClickRemove : function(){
    this.model.collection.remove(this.model)
    return false
  }
  , onChangeMovement : function(){
    this.model.changeMovement($('.movement').val())
  }
  , onChangeMetric : function(){
    this.renderMetrics()
  }
  , onClick : function(){
    if(this.model.get('open')) return
    this.model.collection.each(function(model){
      model.set('open', false)
    })
    this.model.set('open', true)
    return false
  }
  , onClickDone : function(){
    this.model.set('open', false)
    return false
  }
  , onClickUnits : function(){
    this.$('select.units').focus()
  }
  , onChangeMetricInput : function(e){
    var el = $(e.target)
    __el = el
    var metric = el.attr('name')
    var val = el.val()
    if(!isNaN(Number(val))) val = Number(val)
    if(!el.parent().find('select.units').length)
      this.model.set(metric, val)
    else this.model.set(metric, {
      value : val
      , units : this.$('select.units').val()
    })
    console.log('after metric changed')
    console.log(this.model.toJSON())
  }
  , render : function(){
    var template = this['template' + ((this.model.get('open')) ? 'Open' : 'Closed')]
    this.$el.html(template(_.extend(
      {
        movements : movements
      }
      , this.model.toJSON()
    )))
    this.renderMetrics()
    return this
  }
  , renderMetrics : function(){
    var self = this
    this.$('.metrics-container').empty()
    _.each(this.model.get('metrics'), function(metric){
      this.$('.metrics-container')
        .append(
          Templates['workout/editor/metric'](
            _.extend({
                metric : metric
                , units : units[metric]
              }
              , this.model.toJSON()
            )
          )
        )
    }, this)
    this.$('select.units').on('change', function(){
      var metric = $(this).data('metric')
      self.$('.metric.' + metric + ' button.units').text($(this).val())
      self.model.set(metric,{
        value : self.model.get(metric).value
        , units : $(this).val()
      })
    })
  }
})


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

$(function(){
  var editor = new WorkoutEditor({
    wodtypes : wodtypes 
  })
  $('.page-container').append(editor.$el)
})
},{"./../../data/movements.js":1}]},{},[1,2])
;