var should = require('should')
  , mongoose = require('mongoose')
  , Workout = require( __dirname + '/../../models/workout.js')
  , workoutFixture = require('../fixtures/workout.json')
  , _ = require('underscore')
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
      var pr1 = require('../fixtures/pr1')
      var workout1 = new Workout(pr1)
      workout1.save(function(err){
        should.not.exist(err)
        var pr2 = require('../fixtures/pr2')
        var workout2 = new Workout(pr2)
        workout2.save(function(err){
          should.not.exist(err)
          Workout.getRecords(function(err, records){
            should.not.exist(err)
            console.log(records)
            var rep2max = _.find(records, function(r){ 
              return r._id.name === 'deadlift' && r._id.reps === 2 
            })
            console.log(records[0])
            should.exist(rep2max)
            should.exist(rep2max.value.metrics)
            should.exist(rep2max.value.metrics.weight)
            rep2max.value.metrics.weight.value.should.be.equal(210)
            var rep3max = _.find(records, function(r){ 
              return r._id.name === 'deadlift' && r._id.reps === 3
            })
            should.exist(rep3max)
            should.exist(rep3max.value)
            should.exist(rep3max.value.metrics)
            rep3max.value.metrics.weight.value.should.be.equal(110)
            done()
          })
        })
      })
    })
  })
})