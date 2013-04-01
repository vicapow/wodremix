var units = require('./../../data/units.js')

var ResultsView = Backbone.View.extend({
  className : 'results'
  , tasks : null
  , model : null
  , template : Templates['workout/results']
  , results : new Backbone.Collection()
  , initialize : function(opts){
    this.tasks = opts.tasks
    this.model = opts.model
    this.listenTo(this.tasks, 'add', this.render)
    this.listenTo(this.tasks, 'remove', this.render)
    this.listenTo(this.model, 'change:type', this.render)
    this.render()
  }
  , render : function(){
    var type = this.model.get('type')
    if(!type) return
    if(!this.tasks.length) return this.$el.empty()
    this.$el.html(this.template())
    var template = Templates['workout/results/' + type]
    this.$('.tasks').html(template(_.extend({},{
      lifts : this.tasks.toJSON()
      , units : units[type]
    })))
  }
})

module.exports = ResultsView