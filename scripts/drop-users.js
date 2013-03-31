var mongoose = require('mongoose')
  , User = require('../models/user')

mongoose.connect(require('../config').db.path)

User.remove({}, function(err){
  if(err) throw err
  mongoose.disconnect()
})