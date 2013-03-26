if(typeof __pages === 'undefined' ) __pages = {}
__pages.wodResults = function(){
  $(function(){
    d3.select('.container .graph-results')
      .selectAll('div')
      .data([])
  })
}