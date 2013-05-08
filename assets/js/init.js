require('jquery-browserify')
window._ = require('underscore')
window.Backbone = require('backbone')
require('./mobile/iphone.js')
window.d3 = require('d3')

$(function(){
  require('../components/ftlabs-fastclick/lib/fastclick.js')(document.body);
})