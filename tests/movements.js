var should = require("should")
  , mongoose = require('mongoose')
  , movements = require( __dirname + '/../assets/data/movements.js')
  , _ = require('underscore')

describe('Data', function(){
  describe('movements', function(){
    it('should have movements', function(done){
      should.exist(movements)
      should.exist(movements['clean and jerk'])
      var roundMovements = movements.filterForWorkout('rounds')
      _.keys(roundMovements).length.should.be.above(0)
      var weightMovements = movements.filterForWorkout('weight')
      _.keys(weightMovements).length.should.be.below(_.keys(roundMovements).length)
      done()
    })
  })
})