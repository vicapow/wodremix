var wodtypes = require('./../../data/wodtypes.js')
var WorkoutEditor = require('../views/workout-editor.js')

$(function(){
  var editor = new WorkoutEditor({wodtypes:wodtypes})
  $('.page-container').append(editor.$el)
})