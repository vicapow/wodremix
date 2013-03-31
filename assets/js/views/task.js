var units = require('./../../data/units.js')
  , movements = require('./../../data/movements.js')

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

module.exports = TaskView