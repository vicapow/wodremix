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
      metrics : {
        reps : {
          value : this.get('value')
          , units : this.get('units')
        }
      }
    }
  }
})

module.exports = RepsResult