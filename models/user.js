var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , bcrypt = require('bcrypt')


var UserSchema = new Schema({
  username : {
    type : String
    , index : {
      unique : true
    }
  }
  , password : {
    type : String
  }
  , salt : {
    type : String
  }
})

UserSchema.methods.setPassword = function(password){
  this.salt = bcrypt.genSaltSync(10)
  this.password = bcrypt.hashSync(password, this.salt)
  return this
}
UserSchema.methods.checkPassword = function(password){
  if(!this.password || !this.salt) return false
  var hash = bcrypt.hashSync(password, this.salt)
  return (hash === this.password)
}

UserSchema.statics.login = function(username, password, cb){
  User.findOne({username: username}, function(err, user){
    if(err) return cb(err)
    if(!user) return cb(null, false)
    if(user.checkPassword(password)) return cb(null, user)
    return cb(null, null)
  })
}




var User = module.exports = mongoose.model('User', UserSchema);