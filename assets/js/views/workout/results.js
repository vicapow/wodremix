var units = require('./../../../data/units.js')
  , _ = require('underscore')

var ResultsView = Backbone.View.extend({
  className : 'results'
  , template : Templates['workout/results']
  , workout : null
  , resultMetric : null
  , resultMetricSet : null
  , initialize : function(opts){
    this.workout = opts.workout
    this.listenTo(this.workout.result, 'change:metric', this.onResultMetricChange)
    this.listenTo(this.workout, 'change:type', this.render)
    this.listenTo(this.workout, 'change:reps', this.render)
    this.render()
    this.$el.hide()
  }
  , events : {
    'change input[name=reps]' : 'onChangeReps'
    , 'change .duration select[name=minutes]' : 'onTimeChange'
    , 'change .duration select[name=seconds]' : 'onTimeChange'
    , 'change .rounds select[name=rounds]' : 'onRoundsChange'
    , 'change .rounds select[name=reps]' : 'onRoundsChange'
    , 'change .set input[name=weight]' : 'onChangeSetWeight'
    , 'change .set select[name=units]' : 'onChangeSetWeightUnits'
    , 'change .set input[name=reps]' : 'onChangeSetReps'
  }
  , __getSetMetric : function(order, metric){
    var sets = this.workout.result.get('metric').get('sets')
    var set = sets.findWhere({order:order})
    return set.get(metric)
  }
  , onChangeSetWeight : function(e){
    var $el = $(e.target)
    var order = $el.data('order')
    var metric = this.__getSetMetric(order, 'weight')
    metric.value = $el.val()
  }
  , onChangeSetWeightUnits : function(e){
    var $el = $(e.target)
    var order = $el.data('order')
    var metric = this.__getSetMetric(order, 'weight')
    metric.units = $el.val()
  }
  , onChangeSetReps : function(e){
    var $el = $(e.target)
    var order = $el.data('order')
    var metric = this.__getSetMetric(order, 'reps')
    metric.value = $el.val()
  }
  , onResultMetricChange : function(result){
    if(this.resultMetric)
      this.stopListening(this.resultMetric)
    if(this.resultMetricSet)
      this.stopListening(this.resultMetricSet)
    var metric = this.resultMetric = result.get('metric')
    var sets = metric.get('sets')
    this.resultMetricSet = sets
    if(!sets) return
    this.listenTo(sets, 'change', this.render)
    this.listenTo(sets, 'add', this.render)
    this.listenTo(sets, 'remove', this.render)
    this.render()
  }
  , onResultSetChange : function(){
    this.render()
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
    var minutes = this.$('.duration select[name=minutes]').val()
    var seconds = this.$('.duration select[name=seconds]').val()
    var total = minutes * 60 + seconds
    var duration = this.workout.result.get('metric').set({
      value : total
      , units : "seconds"
    })
  }
  , updateSelectReps : function(){
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
    console.log('reps in a round : ' + repsInARound )
    var rounds = this.$('.rounds select[name=rounds]').val()
    var reps = this.$('.rounds select[name=reps]').val()
    console.log('rounds: ' + rounds)
    console.log('reps in a round : ' + repsInARound )
    console.log('reps: ' + reps)
    var total = rounds * repsInARound + Number(reps)
    console.log('total: ' + total)
    this.workout.result.get('metric').set({
      value : total
      , units : "reps"
    })
  }
  , render : function(){
    var $el = this.$el
    var type = this.workout.get('type')
    var workout = this.workout
    if(!type) return
    $el.html(this.template())
    var template = Templates['workout/results/' + type]
    var sets = workout.result.get('metric').get('sets')
    sets = sets && sets.toJSON() || []
    // TODO: change class name from `.tasks` to `.sets`
    this.$('.tasks').html(template({
      sets : sets
      , units : units[type]
    }))
    this.updateSelectReps()
    if(!this.$el.is(':visible') && this.workout.tasks.length)  this.$el.show()
    else if(!this.workout.tasks.length && this.$el.is(':visible')) this.$el.hide()
  }
})

module.exports = ResultsView