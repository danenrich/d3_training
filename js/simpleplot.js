/**
 * TODO: change this to "scatterplot" since that's what it is.
 *
 * @param selection
 *            selector which is assumed to be a div full of JSON data to plot:
 *            [ {x,y} ,...].
 */
function simpleplot(selection) {

  var data = JSON.parse(selection.select('.data').text());

  var margin = {
    top: 10,
    right: 10,
    bottom: 20,
    left: 40
  };
  var width = 350 - margin.left - margin.right;
  var height = 250 - margin.top - margin.bottom;

  var xset = data.map(function(a) {
    return a.x;
  });
  var xmin = d3.min(xset);
  var xmax = d3.max(xset);
  var yset = data.map(function(a) {
    return a.y;
  });
  var ymin = d3.min(yset);
  var ymax = d3.max(yset);

  var xscale = d3.scale.linear().domain([xmin, xmax]).range([0, width]);
  var yscale = d3.scale.linear().domain([ymin, ymax]).range([height, 0]);

  var xAxis = d3.svg.axis().scale(xscale).orient('bottom');
  var yAxis = d3.svg.axis().scale(yscale).orient('left');

  var line = d3.svg.line().x(function(d) {
    return xscale(d.x);
  }).y(function(d) {
    return yscale(d.y);
  });

  var svg = selection
    .append('svg')
    .datum(data)
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  svg.append('g').attr('class', 'x axis').attr('transform',
      'translate(0,' + height + ')').call(xAxis);

  svg.append('g').attr('class', 'y axis').call(yAxis);

  svg.append('path').attr('class', 'line').attr('d', line);

  svg.selectAll('.dot')
    .data(data).enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('cx', line.x())
    .attr('cy', line.y())
    .attr('r', 3.5);

}


/** find all the divs of class simpleplot and render them on document ready */
$(document).ready(function() {
  d3.selectAll('.simpleplot').each(function() {
    simpleplot(d3.select(this));
  });
});
