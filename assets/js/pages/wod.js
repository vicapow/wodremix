
var WorkoutEditor = require('../views/workout-editor.js')

// views

$(function(){
  var editor = new WorkoutEditor()
  $('.page-container').append(editor.$el)
})