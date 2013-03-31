

// views

$(function(){
  var editor = new WorkoutEditor({
    wodtypes : wodtypes 
  })
  $('.page-container').append(editor.$el)
})