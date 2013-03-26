if(typeof __pages === 'undefined' ) __pages = {}
__pages.dashboard = function(){
  $(function(){
    _.each(['aerobic-vs-anaerobic','on-vs-off'], function(graphname){
      var data = _.map(_.range(2), function(d){
        return Math.random() * 100;
      })
      var total = _.reduce(data, function(t, d){ return t + d; })
      d3.select('.container .graph.' + graphname)
        .selectAll('div')
        .data(data)
        .enter()
          .append('div')
          .attr('class','bar')
          .style('width', function(d){ 
            return ( d / total * 100 ) + '%';
          })
          .style('background-color', function(d, i){
            if(i === 0) return '#006dcc'
            else return '#ddd'
          })
    })
    var days = _.range(7)
    d3.select('.container .graph.graph-days-on')
      .selectAll('div')
      .data(days)
      .enter()
        .append('div')
        .attr('class', function(d){
          return 'day ' + ( Math.random() > 0.5 ? 'day-on' : 'day-off')
        })
  })
}