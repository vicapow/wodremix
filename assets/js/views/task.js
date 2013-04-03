var units = require('./../../data/units.js')
  , movements = require('./../../data/movements.js')

var TaskView = Backbone.View.extend({
  tagName : 'tr'
  , templateOpen : Templates['workout/editor/task-open']
  , templateClosed : Templates['workout/editor/task-closed']
  , events : {
    'click .move-up'            : 'onClickUp'
    , 'click .move-down'        : 'onClickDown'
    , 'click .btn-remove'       : 'onClickRemove'
    , 'change .movement'        : 'onChangeMovement'
    , 'click .btn-done'         : 'onClickDone'
    , 'click'                   : 'onClick'
    , 'click button.units'      : 'onClickUnits'
    , 'click button.rep-type'   : 'onClickRepType'
    , 'change .metric input'    : 'onChangeMetricInput'
    , 'change select.rep-type'  : 'onChangeRepTypeSelect'
    , 'change select.units'     : 'onChangeMetricUnitSelect'
  }
  , _prevReps : 1
  , initialize : function(opts){
    this.listenTo(this.model, 'change:open', this.render)
    this.listenTo(this.model, 'change:metrics', this.onChangeMetrics)
    this.listenTo(this.model, 'remove', this.remove)
    this.listenTo(this.model, 'change:workoutType', this.onChangeWorkoutType)
    this.listenTo(this.model, 'change:reps', this.onChangeRepType)
    this.listenTo(this.model, 'all', function(eventName){
      var metrics = this.model.get('metrics')
      if(_.any(metrics, function(metric){
        return eventName === 'change:' + metric
      })) this.onChangeMetric(metric)
    })
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
  , onChangeMetrics : function(){
    this.renderMetrics()
    this.updateClosedMetricBadge()
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
  , onClickRepType : function(){
    this.$('select.rep-type').focus()
  }
  , onChangeRepTypeSelect : function(){
    if(
      this.$('select.rep-type').val() === 'max' 
      && this.model.get('reps') !== 'max' 
    ){
      this._prevReps = this.model.get('reps')
      this.model.set('reps','max')
    }else if(this.model.get('reps') === 'max'){
      this.model.set('reps', this._prevReps)
    }
  }
  , onChangeMetricUnitSelect : function(){
    var $el = $(this)
    var metric = $el.data('metric')
    var units = $el.val()
    this.model.get('metric').units = units
    this.model.trigger('change:' + metric)
  }
  , onChangeRepType : function(){
    if(this.model.get('reps') === 'max'){
      this.$('input[name=reps]').hide()
      this.$('button.rep-type').text('max reps')
    }else{
      this.$('input[name=reps]').show()
      this.$('button.rep-type').text('reps')
    }
      
  }
  , onChangeMetricInput : function(e){
    var el = $(e.target)
    var metric = el.attr('name')
    var val = el.val()
    if(!isNaN(Number(val))) val = Number(val)
    if(!el.parent().find('select.units').length)
      this.model.set(metric, val)
    else this.model.set(metric, {
      value : val
      , units : $el.parent().find('select.units').val()
    })
  }
  , onChangeWorkoutType : function(){
    this.render()
  }
  , render : function(){
    var template = this['template' + ((this.model.get('open')) ? 'Open' : 'Closed')]
    this.$el.html(template(_.extend({
      movements : movements
    }, this.model.toJSON() )))
    this.renderMetrics()
    this.updateOpenMetricInputOptions()
    return this
  }
  , updateClosedMetricBadge : function(metric){
    if(this.model.get('open')) return
    this.$('.metric.' + metric.units + ' button.units').text(metric.value)
  }
  , updateOpenMetricInputOptions : function(){
    if(!this.model.get('open')) return
    this.$('select.movement').empty()
    var _movements = movements.filterForWorkout(this.model.get('workoutType'))
    _.each(_movements, function(movement){
      var $option = $('<option></option>').val(movement.name).text(movement.label)
      if(movement.name === this.model.get('movement'))
        $option.prop('selected', true)
      this.$('select.movement').append($option)
    }, this)
    
  }
  /**
    * given a string, return a metric object with default units
    */
  , toMetricObj : function(metric){
    if(typeof metric !== 'string') 
      throw new Error('metric is not string in TaskView.toMetricObject metric: '
       + JSON.stringify(metric))
    return {
      metric : metric
      , units : units[metric]
    }
  }
  , renderMetrics : function(){
    var self = this
    this.$('.metrics-container').empty()
    _.each(this.model.get('metrics'), function(metric){
      if(this.model.get('workoutType') === metric) return
      var locals = _.extend( this.model.toJSON()
        , this.toMetricObj(metric))
      this.$('.metrics-container')
        .append(Templates['workout/editor/metric'](locals))
    }, this)
  }
})

module.exports = TaskView