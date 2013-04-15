// FROM: http://stackoverflow.com/questions/2898740/iphone-safari-web-app-opens-links-in-new-window
$(function(){
  $('a').on('click', function(e){
    var $el = $(this)
    if($el.hasClass('prompt-confirm')){
      var msg = 'are you sure?'
      if($el.data('message')) msg = $el.data('message')
      if(!confirm(msg)){
        e.stopPropagation()
        return false
      }
    }
    window.location = $el.attr('href')
    e.stopPropagation()
    return false
  })
})