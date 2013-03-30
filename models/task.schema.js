var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var TaskSchema = new Schema({
  type : String
  , distance : Schema.Types.Mixed
  , weight : Schema.Types.Mixed
  , height : Schema.Types.Mixed
  , duration : Schema.Types.Mixed
  , reps : Number
  , arm : String
  , foot : String
  , note : String
  , direction : String
}, { _id : false })

module.exports = TaskSchema;