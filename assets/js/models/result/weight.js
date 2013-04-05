var Backbone = require('backbone')
var Metric = require('../metric')

var WeightRound = Backbone.Model.extend({
  defaults : {
    weight : {
      value : 0
      , units : "lbs"
    }
    , reps : {
      value : 0
      , units : null
    }
  }
})

var Rounds = Backbone.Collection.extend({
  model: WeightRound
  , initialize : function(){}
})


var WeightResult = Backbone.Model.extend({
  defaults : function(){
    return {
      rounds : new Rounds
    }
  }
  , add : function(){
    this.rounds.add(new WeightRound())
  }
  , remove : function(){
    this.rounds.remove(new WeightRound())
  }
  , toJSON : function(){
    return {
      rounds : this.get('rounds').map(function(round){
        return round.toJSON()
      })
    }
  }
})

module.exports = WeightResult