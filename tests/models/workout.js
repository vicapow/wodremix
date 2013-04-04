var should = require('should')
  , Task = require('../../assets/js/models/task.js')
  , Workout = require('../../assets/js/models/workout.js')
  , movements = require('../../assets/data/movements.js')
  , _ = require('underscore')

describe('Data', function(){
  describe('Task', function(){
    var workout
    beforeEach(function(){
      workout = new Workout("rounds")
    })
    it('should create a workout', function(){
      should.exist(workout)
      should.exist(workout.tasks)
      workout.metric.set('value',20)
    })
    it('should convert to a JSON object', function(){
      var obj = workout.toJSON()
      obj.tasks.should.be.instanceOf(Array)
    })
    it('should add a task', function(){
      workout.tasks.add(new Task(movements['box jump']))
      workout.tasks.length.should.be.above(0)
    })
    it('should set rounds and reps', function(){
      workout.tasks.add(new Task('box jump'))
      workout.tasks.add(new Task('rest'))
    })
    it('should be able to change type', function(){
      var task, metric
      workout.tasks.add(new Task('box jump'))
      var task = new Task('rest')
      workout.tasks.add(task)
      workout.tasks.add(new Task('clean and jerk'))
      workout.set('type','weight')
      workout.tasks.length.should.be.equal(1, 'clean and jerk should be the '
        + 'only movement for this weighted workout')
      task = workout.tasks.findWhere({name:'clean and jerk'})
      should.exist(task)
      metric = task.metrics.findWhere({name:'weight'})
      should.not.exist(metric, 'unused workout metrics should ignored on tasks')
      workout.set('type','rounds')
      task = workout.tasks.findWhere({name:'clean and jerk'})
      should.exist(task)
      metric = task.metrics.findWhere({name:'weight'}, 'previously unused '
        + 'metrics should be added back.')
      should.exist(metric)
    })
  })
})

function print(obj){
  console.log(JSON.stringify(obj, null, 4))
}