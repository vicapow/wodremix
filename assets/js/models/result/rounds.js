var Backbone = require('backbone')
var Metric = require('../metric')

var RoundsResult = Backbone.Model.extend({
  defaults : {
    value : 0
    , units : 'rounds'
  }
})

module.exports = RoundsResult