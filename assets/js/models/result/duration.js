var Backbone = require('backbone')
var Metric = require('../metric')

var DurationResult = Backbone.Model.extend({
  defaults : {
    value : 0
    , units : 'minutes'
  }
})

module.exports = DurationResult