var WorkoutMetricView = Backbone.View.extend({
  className : 'workout-metric'
  , template : Templates['workout/editor/metric']
  , events : {}
  , workout : null
  , initialize : function(opts){
    this.workout = opts.workout
    this.listenTo(this.workout.metric, 'change', this.render)
    this.render()
  }
  , render : function(){
    this.$el.html(this.template(this.workout.metric.toJSON()))
  }
})

module.exports = WorkoutMetricView