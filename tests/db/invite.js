var should = require("should")
   , mongoose = require('mongoose')
   , Invite = require(__dirname + '/../../models/invite.js')

if(mongoose.connection.readyState === 0) mongoose.connect('mongodb://localhost/test')

describe('DB', function(){
  describe('Invite', function(done){
    var code
    beforeEach(function(done){
      Invite.generate(function(err, _code){
        code = _code
        if(err) throw err
        should.exist(code)
        done()
      })
    })
    it('should not accept invalid invite codes', function(done){
      Invite.accept('blaw blaw', function(err, accepted){
        if(err) throw err
        should.exist(accepted)
        accepted.should.not.be.true
        done()
      })
    })
    it('should accept valid invite codes', function(done){
      Invite.accept(code, function(err, accepted){
        if(err) throw err
        should.exist(accepted)
        accepted.should.be.true
        Invite.findOne({code:code}, function(err, invite){
          if(err) throw err
          should.not.exist(invite)
          done()
        })
      })
    })
    it('should not validate an invalid code', function(done){
      Invite.valid('foo bar', function(err, valid){
        if(err) throw err
        should.exist(valid)
        valid.should.be.false
        done()
      })
    })
    it('should validate a valid code', function(done){
      Invite.valid(code, function(err, valid){
        if(err) throw err
        should.exist(valid)
        valid.should.be.true
        done()
      })
    })
  })
})