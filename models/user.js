var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , bcrypt = require('bcrypt')
  , Gym = require('./gym')


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
  // date this record was created
  , created : { type : Date, default : Date.now }
  // the gym this user is a member of
  , gym : Schema.Types.ObjectId
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

UserSchema.methods.getTodaysWorkouts = function(cb){
  if(!this.gym) return cb(null, null)
  Gym.findOneById(this.gym, function(err, gym){
    if(err) return cb(err)
    if(!gym) return cb(null, null)
    return gym.getTodaysWorkouts(cb)
  })
}

UserSchema.statics.login = function(username, password, cb){
  User.findOne({username: username}, function(err, user){
    if(err) return cb(err)
    if(!user) return cb(null, null)
    if(user.checkPassword(password)) return cb(null, user)
    return cb(null, null, { message : 'Invalid username or password.'})
  })
}

UserSchema.methods.addGym = function(gym, cb){
  this.gym = gym
  return this.save(cb)
}




var User = module.exports = mongoose.model('User', UserSchema);