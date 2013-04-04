
var WorkoutEditor = require('../views/workout/editor')

// views

$(function(){
  var editor = new WorkoutEditor()
  $('.page-container').append(editor.$el)
})