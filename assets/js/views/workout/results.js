var units = require('./../../../data/units.js')

var ResultsView = Backbone.View.extend({
  className : 'results'
  , template : Templates['workout/results']
  , tasks : null
  , workout : null
  , result : null
  , initialize : function(opts){
    this.workout = opts.workout
    this.listenTo(this.workout.tasks, 'add', this.onAddTask)
    this.listenTo(this.workout.tasks, 'remove', this.onRemoveTask)
    this.listenTo(this.workout, 'change:type', this.render)
    this.listenTo(this.workout, 'change:reps', this.onRepsChange)
    this.render()
    this.$el.hide()
  }
  , events : {
    'change input[name=reps]' : 'onChangeReps'
    , 'change input[name=weight]' : 'onChangeWeight'
    , 'change .duration input[name=minutes]' : 'onTimeChange'
    , 'change .duration input[name=seconds]' : 'onTimeChange'
    , 'change .rounds select[name=rounds]' : 'onRoundsChange'
    , 'change .rounds select[name=reps]' : 'onRoundsChange'
  }
  , onAddTask : function(task){
    this.render()
    if(!this.$el.is(':visible')) this.$el.show()
  }
  , onRemoveTask : function(task){
    this.render()
    if(this.$el.is(':visible') && !this.workout.tasks.length) this.$el.hide()
  }
  , onChangeReps : function(e){
    var $el = $(e.target)
    var order = $el.data('order')
    var rounds = this.workout.result.get('metric').get('rounds')
    if(!rounds) return
    var round = rounds.findWhere({order:order})
    if(!round) return
    round.get('reps').value = $el.val()
  }
  , onChangeUnits : function(e){
    var $el = $(e.target)
    var order = $el.data('order')
    var rounds = this.workout.result.get('metric').get('rounds')
    if(!rounds) return
    var round = rounds.findWhere({order:order})
    if(!round) return
    alert($el.val())
    round.get('weight').units = $el.val()
  }
  , onTimeChange : function(){
    var minutes = this.$('.duration input[name=minutes]').val()
    var seconds = this.$('.duration input[name=seconds]').val()
    var total = minutes * 60 + seconds
    var duration = this.workout.result.get('metric').get('duration')
    duration.value = total
    duration.units = "seconds"
  }
  , onRepsChange : function(){
    var select = this.$('select[name=reps]')
    var reps = this.workout.get('reps')
    var current = select.val()
    select.empty()
    _.each(_.range(0,reps), function(rep){
      select.append($(
        '<option value="' + rep + '">' 
          + rep + ((rep===1) ? ' rep' : ' reps') 
        + '</option>'))
    }, this)
  }
  , onRoundsChange : function(){
    var repsInARound = this.workout.get('reps')
    var rounds = this.$('.duration input[name=minutes]').val()
    var reps = this.$('.duration input[name=seconds]').val()
    var total = rounds * repsInARound + reps
    var reps = this.workout.result.get('metric').get('reps')
    if(!reps) return
    reps.value = total
    reps.units = "reps"
  }
  , onChangeWeight : function(e){
    var $el = $(e.target)
    var order = $el.data('order')
  }
  , render : function(){
    var $el = this.$el
    var type = this.workout.get('type')
    var workout = this.workout
    if(!type) return
    $el.html(this.template())
    var template = Templates['workout/results/' + type]
    this.$('.tasks').html(template({
      lifts : workout.tasks.toJSON()
      , units : units[type]
    }))
    this.onRepsChange()
  }
})

module.exports = ResultsView