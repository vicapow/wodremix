var should = require('should')
  , Task = require('../../assets/js/models/task')
  , movements = require('../../assets/data/movements')
  , _ = require('underscore')

describe('Data', function(){
  describe('Task', function(){
    var task
    beforeEach(function(){
      task = new Task(movements['clean and jerk'])
    })
    it('should add a task', function(){
      should.exist(task)
      should.exist(task.metrics)
    })
    it('should be stringifable', function(){
      var obj = task.toJSON()
      should.exist(obj)
      should.exist(obj.metrics)
      obj.metrics.should.not.be.an.instanceOf(Array)
      _.keys(obj.metrics).length.should.be.above(0)
    })
    it('should be able to change type', function(){
      var metric = task.metrics.findWhere({name:'reps'})
      metric.set('value', 200)
      task.set('name','run')
      var obj = task.toJSON()
      should.exist(obj)
      should.exist(obj.label)
      should.exist(obj.type)
      should.exist(obj.metrics)
      _.keys(obj.metrics).length.should.be.above(0)
      metric = task.metrics.findWhere({name:'weight'})
      should.not.exist(metric)
    })
  })
})