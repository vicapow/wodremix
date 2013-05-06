
var useragent = require('express-useragent')

module.exports = {
  isMobile : function(req){
    var source = req.headers['user-agent']
    return useragent.parse(source).isMobile || req.headers.host.indexOf('localhost') !== -1;
  }
}