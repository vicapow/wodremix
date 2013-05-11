var mongoose = require('mongoose')
  , Invite = require('../models/invite')

mongoose.connect(require('../config').db.path)

Invite.generate(function(err, code){
  if(err) throw err
  console.log('invite code: ' + code)
  mongoose.disconnect()
})