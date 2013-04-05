var should = require('should')
  , Workout = require('../../assets/js/models/workout.js')
  , Task = require('../../assets/js/models/task.js')
  , Result = require('../../assets/js/models/result/result.js')
  , movements = require('../../assets/data/movements.js')
  , _ = require('underscore')

describe('Data', function(){
  describe('Result', function(){
    var workout
    beforeEach(function(){
      workout = new Workout()
      should.exist(workout)
      workout.tasks.add(new Task('box jump'))
      workout.tasks.add(new Task('clean and jerk'))
      workout.tasks.length.should.be.equal(2)
    })
    it('should create a workout', function(){
      workout.set('type', 'rounds')
      workout.result.get('type').should.be.equal('rounds')
      should.exist(workout.result.get('metric'))
      workout.result.get('metric').get('value').should.equal(0)
    })
    it('should be a part of the workout json', function(){
      var o = workout.toJSON()
      should.exist(o)
      should.exist(o.result)
      should.exist(o.result.value)
      should.exist(o.result.units)
    })
    it('should have rounds in the result for weight workouts', function(){
      workout.set('type', 'weight')
      should.exist(workout.result.get('metric'))
      should.exist(workout.result.get('metric').get('rounds'))
      var o = workout.toJSON()
      should.exist(o)
      should.exist(o.result)
      should.exist(o.result.rounds)
      o.result.rounds.should.be.instanceOf(Array)
      workout.result.get('metric').get('rounds').length.should.be.above(0)
    })
  })
})