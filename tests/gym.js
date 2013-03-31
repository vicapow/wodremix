var should = require("should")
   , mongoose = require('mongoose')
   , Gym = require( __dirname + '/../models/gym.js')
   , User = require(__dirname + '/../models/user.js')
   , userFixture = require('./fixtures/user')
if(mongoose.connection.readyState === 0) mongoose.connect('mongodb://localhost/test')

describe('DB', function(){
  var gym
  it('should add a user', function(done){
    var gym = new Gym({
      name : 'Grass Roots Crossfit'
    })
    gym.save(function(err){
      should.not.exist(err)
      done()
    })
  })
  describe('Gym', function(){
    beforeEach(function(done){
      Gym.remove({}, function(err){
        should.not.exist(err)
        User.remove({}, function(err){
          should.not.exist(err)
          gym = new Gym({
            name : 'Grass Roots Crossfit'
          })
          gym.save(function(err){
            should.not.exist(err)
            done()
          })
        })
      })
    })
    it('should allow a member to be added', function(done){
      var user = new User(userFixture)
      var userId = user._id;
      gym.addMember(user, function(err){
        should.not.exist(err)
        User.findById(userId, function(err, user){
          should.not.exist(err)
          should.exist(user)
          user.gym.toString().should.equal(gym._id.toString())
          done()
        })
      })
    })
  })
})