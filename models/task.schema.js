var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var TaskSchema = new Schema({
  type : String
  , label : String
  , name : String
  , metrics : {
    distance : {
      value : Number
      , units : String
    }
    , weight : {
      value : Number
      , units : String
    }
    , height : {
      value : Number
      , units : String
    }
    , duration : {
      value : Number
      , units : String
    }
    , reps : {
      value : Number
    }
    , arm : {
      value : String
    }
    , foot : {
      value : String
    }
    , direction : {
      value : String
    }
  }
}, { _id : false })

module.exports = TaskSchema;