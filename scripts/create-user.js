var mongoose = require('mongoose')
  , User = require('../models/user')
  , optimist = require('optimist')
mongoose.connect('mongodb://localhost/test')

User.collection.drop()

var user = new User({
  username : 'test'
}).setPassword('test')
user.save(function(err){
  if(err) throw err
  console.log('added user!')
  mongoose.disconnect();
})