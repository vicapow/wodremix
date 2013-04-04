var _ = require('underscore')
var Backbone = require('backbone')
var Metric = require('./metric.js')

var Metrics = Backbone.Collection.extend({
  model: Metric
  , toJSON : function(){
    var metrics = Backbone.Collection.prototype.toJSON.apply(this) // NOTE: Array
    metrics = _.object(this.pluck('name'), metrics) // NOTE: Object
    _.each(metrics, function(metric){ delete metric.name })
    return metrics
  }
})

module.exports = Metrics