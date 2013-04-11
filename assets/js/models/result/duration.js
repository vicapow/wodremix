var Backbone = require('backbone')
var Metric = require('../metric')

var DurationResult = Backbone.Model.extend({
  defaults : {
    value : 0
    , units : 'minutes'
  }
  , constructor : function(opts){
    Backbone.Model.call(this)
  }
  , toJSON: function(){
    return {
      duration : {
        value : Number(this.get('value'))
        , units : this.get('units')
      }
    }
  }
})

module.exports = DurationResult