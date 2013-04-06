var units = require('./../../../data/units.js')

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
    , 'change input[name=weight]' : 'onChangeWeight'
    , 'change .duration input[name=minutes]' : 'onTimeChange'
    , 'change .duration input[name=seconds]' : 'onTimeChange'
    , 'change .rounds select[name=rounds]' : 'onRoundsChange'
    , 'change .rounds select[name=reps]' : 'onRoundsChange'
  }
  , onResultMetricChange : function(result){
    if(this.resultMetric) {
      this.stopListening(this.resultMetric)
      if(this.resultMetricSet)
        this.stopListening(this.resultMetricSet)
    }
    var metric = this.resultMetric = result.get('metric')
    var set = metric.get('sets')
    this.resultMetricSet = set
    if(!set) return
    this.listenTo(set, 'add', this.onResultSetChange)
    this.listenTo(set, 'change', this.onResultSetChange)
    this.listenTo(set, 'remove', this.onResultSetChange)
    this.render()
  }
  , onResultSetChange : function(){
    if(!this.$el.is(':visible') && this.resultMetricSet.length) 
      this.$el.show()
    else if(!this.resultMetricSet.length && this.$el.is(':visible')) 
      this.$el.hide()
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
    var minutes = this.$('.duration input[name=minutes]').val()
    var seconds = this.$('.duration input[name=seconds]').val()
    var total = minutes * 60 + seconds
    var duration = this.workout.result.get('metric').get('duration')
    duration.value = total
    duration.units = "seconds"
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
    var sets = workout.result.get('metric').get('sets')
    sets = sets && sets.toJSON() || []
    // TODO: change class name from `.tasks` to `.sets`
    this.$('.tasks').html(template({
      sets : sets
      , units : units[type]
    }))
    this.updateSelectReps()
  }
})

module.exports = ResultsView