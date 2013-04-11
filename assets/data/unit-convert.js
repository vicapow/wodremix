
var conversions = {
  // weight
  // from : http://www.onlineconversion.com/weight_all.htm
  "pounds" : {
    "kilograms" : 0.45359237
    , "poods" : 0.027827752761
  }
  , "kilograms" : {
    "pounds" : 2.2046226218
    , "poods" : 0.061349693252
  }
  , "poods" : {
    "kilograms" : 16.3
    , "pounds" : 35.935348736
  }
}

var convert = function(metric, to){
  var from = metric.units
  var value = metric.value
  return conversions[from][to] * value
}

convert.conversions = conversions

module.exports = convert