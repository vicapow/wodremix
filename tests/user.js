var should = require("should")
var mongoose = require('mongoose')
var User = require( __dirname + '/../models/user.js')
if(mongoose.connection.readyState === 0) mongoose.connect('mongodb://localhost/test')

describe('DB', function(){
  describe('User', function(){
    beforeEach(function(done){
      User.remove({},function(err){
        should.not.exist(err)
        done()
      })
    })
    it('should add a user', function(done){
      new User({
        username : 'vicapow'
      }).save(function(err){
        should.not.exist(err)
        done()
      })
    })
    it('should not add a duplicate', function(done){
      new User({
        username : 'vicapow'
      }).save(function(err){
        should.not.exist(err)
        var user = new User({
          username : 'vicapow'
        }).save(function(err){
          should.exist(err)
          done()
        })
      })
    })
    it('should set the users password', function(done){
      new User({
        username : 'vicapow'
      }).setPassword('password').save(function(err){
        should.not.exist(err)
        User.findOne({username:'vicapow'}, function(err, user){
          should.not.exist(err)
          should.exist(user)
          user.password.should.not.equal('password')
          user.checkPassword('not password').should.be.false
          user.checkPassword('password').should.be.true
          done()
        })
      })
    })
    it('should allow login', function(done){
      new User({
        username : 'vicapow'
      }).setPassword('password').save(function(err){
        should.not.exist(err)
        User.login('vicapow', 'password', function(err, user){
          should.exist(user)
          User.login('vicapow', 'not password', function(err, user){
            should.not.exist(user)
            done()
          })
        })
      })
    })
  })
})