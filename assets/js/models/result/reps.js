var Backbone = require('backbone')
var Metric = require('../metric')

var RepsResult = Backbone.Model.extend({
  defaults : {
    value : 0
    , units : 'reps'
  }
})

module.exports = RepsResult