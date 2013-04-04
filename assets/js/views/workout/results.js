var units = require('./../../../data/units.js')

var ResultsView = Backbone.View.extend({
  className : 'results'
  , tasks : null
  , workout : null
  , template : Templates['workout/results']
  , results : new Backbone.Collection()
  , initialize : function(opts){
    this.workout = opts.workout
    this.listenTo(this.workout.tasks, 'add', this.render)
    this.listenTo(this.workout.tasks, 'remove', this.render)
    this.listenTo(this.workout, 'change:name', this.render)
    this.render()
  }
  , render : function(){
    var name = this.workout.get('name')
    var $el = this.$el
    var workout = this.workout
    if(!name) return
    if(!workout.tasks.length) return $el.empty()
    $el.html(this.template())
    var template = Templates['workout/results/' + name]
    this.$('.tasks').html(template({
      lifts : this.tasks.toJSON()
      , units : units[name]
    }))
  }
})

module.exports = ResultsView