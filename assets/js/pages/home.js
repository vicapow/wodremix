var wodtypes = require('./../../data/wodtypes.js')
var WorkoutEditor = require('../views/workout/editor')

$(function(){
  var editor = new WorkoutEditor()
  $('.page-container').append(editor.$el)
})