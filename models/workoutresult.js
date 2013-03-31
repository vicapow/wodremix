var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , _ = require('underscore')
  , TaskSchema = require('./task.schema')

var WorkoutResultSchema = new Schema({
  type : String
  , rounds : Number
  , score : Number
  , time : Number
  , tasks : [TaskSchema]
  , workout : Schema.Types.ObjectId
  , created : { type : Date, default : Date.now }
},{ strict: true })

module.exports = mongoose.model('WorkoutResult', WorkoutResultSchema)
var WorkoutResult = module.exports