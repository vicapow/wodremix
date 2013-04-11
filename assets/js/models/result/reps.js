var Backbone = require('backbone')
var Metric = require('../metric')

var RepsResult = Backbone.Model.extend({
  defaults : {
    value : 0
    , units : 'reps'
  }
  , constructor : function(opts){
    Backbone.Model.call(this)
  }
  , toJSON : function(){
    return {
      reps : {
        value : Number(this.get('value'))
        , units : this.get('units')
      }
    }
  }
})

module.exports = RepsResult