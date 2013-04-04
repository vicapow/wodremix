var should = require("should")
  , mongoose = require('mongoose')
  , Workout = require( __dirname + '/../../models/workout.js')
  , pr = require('../fixtures/pr.json')
  , workoutFixture = require('../fixtures/workout.json')
if(mongoose.connection.readyState === 0) mongoose.connect('mongodb://localhost/test')

describe('DB', function(){
  describe('Workout', function(){
    beforeEach(function(done){
      Workout.remove({},function(err){
        should.not.exist(err)
        done()
      })
    })
    it('should add a workout', function(done){
      var workout = Workout.cleanTasks(workoutFixture)
      workout = new Workout(workout).save(function(err){
        should.not.exist(err)
        Workout.findOne({}, function(err, workout){
          should.not.exist(err)
          should.exist(workout)
          done()
        })
      })
    })
    it('should add a PR workout', function(done){
      var workout = Workout.cleanTasks(pr)
      workout = new Workout(workout).save(function(err){
        should.not.exist(err)
        Workout.findOne({}, function(err, workout){
          should.not.exist(err)
          should.exist(workout)
          done()
        })
      })
    })
  })
})