
var abbrs = {
  "pounds" : 'lbs'
  , 'kilograms' : 'kg'
  , 'poods' : 'poods'
  , 'meters' : 'm'
  , 'feet' : 'ft'
  , 'miles' : 'ml'
  , 'kilometers' : 'km'
  , 'centimeters' : 'cm'
  , 'yards' : 'yd'
  , 'seconds' : 'sec'
  , 'minutes' : 'min'
}

module.exports = function(abbr){
  if(abbrs[abbr]) return abbrs[abbr]
  else return abbr
}