var mongoose = require('mongoose')
  , Gym = require('../models/gym')
  , argv = require('optimist')
    .demand('name')
    .argv

mongoose.connect(require('../config').db.path)

new Gym({
  name : argv.name
}).save(function(err){
  if(err) throw err
  console.log('success!')
  mongoose.disconnect()
})