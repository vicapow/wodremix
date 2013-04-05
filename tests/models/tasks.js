var should = require('should')
  , Task = require('../../assets/js/models/task.js')
  , Tasks = require('../../assets/js/models/tasks.js')
  , _ = require('underscore')

describe('Data', function(){
  describe('Tasks', function(){
    var tasks
    beforeEach(function(){
      tasks = new Tasks()
    })
    it('should create tasks collection', function(){
      should.exist(tasks)
    })
    it('should add a task', function(){
      var task1 = new Task('double under')
      tasks.add(task1)
      task1.get('order').should.be.equal(0)
      var task2 = new Task('clean and jerk')
      tasks.add(task2)
      task2.get('order').should.be.equal(1)
      task2.moveUp()
      task2.get('label').should.be.equal(tasks.at(0).get('label'))
      task2.get('order').should.be.equal(0)
    })
    it('should update the order when items are removed', function(){
      var task1 = new Task('double under')
      tasks.add(task1)
      var task2 = new Task('clean and jerk')
      tasks.add(task2)
      tasks.remove(task1)
      task2.get('order').should.be.equal(0)
    })
  })
})