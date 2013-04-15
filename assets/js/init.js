require('jquery-browserify')
_ = require('underscore')
Backbone = require('backbone')
require('./../flatstrap/assets/js/bootstrap.js')
require('./mobile/iphone.js')

$(function(){
  require('../components/ftlabs-fastclick/lib/fastclick.js')(document.body);
})