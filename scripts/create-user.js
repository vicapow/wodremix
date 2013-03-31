var mongoose = require('mongoose')
  , User = require('../models/user')
  , Gym = require('../models/gym')
  , argv = require('optimist')
    .demand('username')
    .demand('password')
    .argv

mongoose.connect(require('../config').db.path)

var user = new User({
  username : argv.username
}).setPassword(argv.password)
user.save(function(err){
  if(err) throw err
  console.log('success!')
  if(!argv.gym) return done()
  Gym.findOne({}, function(err, gym){
    if(err) throw err
    if(!gym) throw new Error("no gyms exist!")
    user.gym = gym.id
    user.save(function(err){
      if(err) throw err
      return done()
    })
  })
})

function done(){
  mongoose.disconnect();
}