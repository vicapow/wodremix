var units = require('./../../../data/units.js')
  , movements = require('./../../../data/movements.js')

var TaskView = Backbone.View.extend({
  tagName : 'tr'
  , templateOpen : Templates['workout/editor/task/open']
  , templateClosed : Templates['workout/editor/task/closed']
  , events : {
    'click .move-up'            : 'onClickUp'
    , 'click .move-down'        : 'onClickDown'
    , 'click .btn-remove'       : 'onClickRemove'
    , 'change .movement'        : 'onChangeMovement'
    , 'click .btn-done'         : 'onClickDone'
    , 'click'                   : 'onClick'
  //   , 'click button.units'      : 'onClickUnits'
  //   , 'click button.rep-type'   : 'onClickRepType'
  , 'change .metric input'    : 'onChangeMetricInput'
  //   , 'change select.rep-type'  : 'onChangeRepTypeSelect'
  //   , 'change select.units'     : 'onChangeMetricUnitSelect'
  }
  //, _prevReps : 1
  , initialize : function(opts){
    this.workout = opts.workout
    this.listenTo(this.model, 'change:open', this.render)
    // this.listenTo(this.model, 'change:metrics', this.onChangeMetrics)
    this.listenTo(this.model, 'remove', this.remove)
    this.listenTo(this.model.metrics, 'add', this.onChangeMetrics)
    this.listenTo(this.model.metrics, 'remove', this.onChangeMetrics)
    this.model.set('open', true)
    this.listenTo(this.workout, 'change:type', this.onChangeWorkoutType)
    this.render()
  }
  , onClickUp : function(e){
    var model = this.model
    model.moveUp()
  }
  , onClickDown : function(e){
    this.model.moveDown()
  }
  , onClickRemove : function(){
    // remove this model from its collection
    this.model.collection.remove(this.model)
    return false
  }
  , onChangeMovement : function(){
    var newName = this.$('.movement').val()
    this.model.set('name', newName)
  }
  , onChangeMetrics : function(metric){
    this.renderMetrics()
    //this.updateClosedMetricBadge()
  }
  , onClick : function(){
    if(this.model.get('open')) return
    this.workout.tasks.each(function(task){
      task.set('open', false)
    })
    this.model.set('open', true)
    return false
  }
  , onClickDone : function(){
    this.model.set('open', false)
    return false
  }
  // , onClickUnits : function(){
  //   this.$('select.units').focus()
  // }
  // , onClickRepType : function(){
  //   this.$('select.rep-type').focus()
  // }
  // , onChangeRepTypeSelect : function(){
  //   if(
  //     this.$('select.rep-type').val() === 'max' 
  //     && this.model.get('reps') !== 'max' 
  //   ){
  //     this._prevReps = this.model.get('reps')
  //     this.model.set('reps','max')
  //   }else if(this.model.get('reps') === 'max'){
  //     this.model.set('reps', this._prevReps)
  //   }
  // }
  // , onChangeMetricUnitSelect : function(){
  //   var $el = $(this)
  //   var metric = $el.data('metric')
  //   var units = $el.val()
  //   this.model.get('metric').units = units
  //   this.model.trigger('change:' + metric)
  // }
  // , onChangeRepType : function(){
  //   if(this.model.get('reps') === 'max'){
  //     this.$('input[name=reps]').hide()
  //     this.$('button.rep-type').text('max reps')
  //   }else{
  //     this.$('input[name=reps]').show()
  //     this.$('button.rep-type').text('reps')
  //   }
  //     
  // }
  , onChangeMetricInput : function(e){
    var $el = $(e.target)
    var metric = $el.attr('name')
    var val = $el.val()
    if(!isNaN(Number(val))) val = Number(val)
    var metric = this.model.metrics.findWhere({name:metric})
    metric.set('value', val)
    if($el.parent().find('select.units').length)
      metric.set('units', $el.parent().find('select.units').val())
  }
  , onChangeWorkoutType : function(){
    this.render()
  }
  , render : function(){
    var templateName = 'template' + ((this.model.get('open')) ? 'Open' : 'Closed')
    var template = this[templateName]
    this.$el.html(template(_.extend(
      { movements : movements }
      , this.model.toJSON()
      , { metricNames : this.model.metrics.pluck('name') }
    )))
    this.renderMetrics()
    this.updateOpenMetricInputOptions()
    return this
  }
  // , updateClosedMetricBadge : function(metric){
  //   if(this.model.get('open')) return
  //   this.$('.metric.' + metric.units + ' button.units').text(metric.value)
  // }
  , updateOpenMetricInputOptions : function(){
    if(!this.model.get('open')) return
    this.$('select.movement').empty()
    var _movements = movements.filterForWorkout(this.workout.get('type'))
    _.each(_movements, function(movement){
      var $option = $('<option></option>')
        .val(movement.name)
        .text(movement.label)
      if(movement.name === this.model.get('name')){
        $option.prop('selected', true)
      }
      this.$('select.movement').append($option)
    }, this)
  }
  , renderMetrics : function(){
    this.$('.metrics-container').empty()
    this.model.metrics.each(function(metric){
      if(this.model.get('workoutType') === metric.get('name')) return
      var locals = _.extend( {unitOpts: units}, this.model.toJSON(), metric.toJSON() )
      this.$('.metrics-container')
        .append(Templates['workout/editor/task/metric'](locals))
    }, this)
  }
})

module.exports = TaskView