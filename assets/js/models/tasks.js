
var Task = require('./task.js')
var Backbone = require('backbone')

var Tasks = Backbone.Collection.extend({
  model: Task
  , initialize : function(){
    this.listenTo(this, 'add', this.onAdd)
    this.listenTo(this, 'remove', this.onRemove)
    this.order = 0
    this.comparator = function(task){
      return task.get('order')
    }
  }
  , onAdd : function(task){
    task.set('order', this.order++)
  }
  , onRemove : function(task){
    this.order = 0
    this.each(function(task){
      task.set('order', this.order++)
    }, this)
    this.sort()
  }
  , nextOrder : function() {
    if (!this.length) return 1
    return this.last().get('order') + 1
  }
  , comparator: function(task){
    return task.get('order')
  }
  , 
})

module.exports = Tasks