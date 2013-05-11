var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Workout = require('./workout')
  , User = require('./user')
  , crypto = require('crypto')


var InviteSchema = new Schema({
  code : String
})

InviteSchema.statics.generate = function generate(cb){
  var invite = new Invite()
  var seed = crypto.randomBytes(20)
  invite.code = crypto.createHash('sha1').update(seed).digest('hex')
  invite.save(function(err){
    return cb(err, invite.code)
  })
}

InviteSchema.statics.valid = function valid(code, cb){
  Invite.findOne({code: code}, function(err, invite){
    return cb(null, !!invite)
  })
}

InviteSchema.statics.accept = function accept(code, cb){
  Invite.findOne({code : code}, function(err, invite){
    if(err) return cb(err)
    if(!invite) return cb(null, false)
    invite.remove()
    return cb(null, true)
  })
}

var Invite = module.exports = mongoose.model('Invite', InviteSchema);