var mongoose = require('mongoose')
  , Gym = require('../models/gym')

mongoose.connect(require('../config').db.path)

Gym.remove({}, function(err){
  if(err) throw err
  mongoose.disconnect()
})