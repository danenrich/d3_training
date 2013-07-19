//Set the margins for the chart
var margin = {top: 50, right: 150, bottom: 80, left: 150},
    width = 1080 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

//Using the basic d3 colors
var color = d3.scale.category10();

//Create an object in the DOM before the svg object on which to latch on our pulldowns
var pulldownrow = d3.select("body").append("div")
  .attr("class", "pulldownrow");

//Drop the SVG object after the pulldowns
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Scale analytics. These live outside of the .forEach function.
var yScale = d3.scale.ordinal().rangeRoundBands([0, height]);

var yAxis = d3.svg.axis()
  .scale(yScale)
  .orient("left");  

var xScale = d3.scale.ordinal().rangeRoundBands([width, 0]);

var xAxis = d3.svg.axis()
  .scale(xScale)
  .orient("bottom");

//Hard-coding axis options
var layout_choices = [{"Pipeline Balance": {x:"phases",y:"tas",z:"enpvs",cfill:"buckets"}},
                    {"Compound-Indications":{x:"compounds",y:"indications",z:"npvs",cfill:"tas"}},
                    {"Alignment":{x:"statuses",y:"buckets",z:"npvs",cfill:"phases"}}];

var layout_choice = "Pipeline Balance"; //Text string of selected option
/*
function redo_layout(x) {
  layout_choices.filter(function(d,i) {return layout_choices[i][layout_choice] !== undefined})[0][layout_choice];
};
*/
//var layout_data = redo_layout(layout_choice);
var layout_data = layout_choices.filter(function(d,i) {return layout_choices[i][layout_choice] !== undefined})[0][layout_choice];  //The x,y,z,fill for the selected layout
var layout_strings = []; //layout_strings is an array of the layout options as text strings
for(i=0;i<layout_choices.length;i++) {
  layout_strings[i] = d3.keys(layout_choices[i]);
  };

var change_layout = function() {
  alert("Your mom");
  layout_choice = "Alignment";
  layout_data;
};

/*  var change_layout = $("#pulldown_layout").change(function() {
    layout_choice = $(this).val();
  }).change();
*/

//Get the data and start drawing
d3.csv("bingo_data.csv", function(error, data) {
  data.forEach(function(d) {
    d.names = d.names;
    d.y = d[layout_data.y];
    d.x = d[layout_data.x];
    d.z = +d[layout_data.z];
    d.sb = d[layout_data.cfill]; 
  });

  //build the drop-down for choosing the x-axis
  d3.select(".pulldownrow")
    //add label
    .append("div")
      .attr("class", "pulldownlabel")
      .text("Choose Layout: ")
    //add drop-down
    .append("select")
      .attr("id", "pulldown_layout")
    .on("change", change_layout)
    //add options
    .selectAll("option")
      .data(layout_strings)
      .enter()
        .append("option")
        .attr("class", "pulldownoption")
        .text(function(d){ return d; });

	//Get list of elements (e.g. TAs) for the y-axis
  var y_list = d3.nest()
    .key(function(d) { return d.y; }).sortKeys(d3.ascending) 
    .entries(data);

	//Get list of elements (e.g. Phases) for the x-axis
  var x_list = d3.nest()
    .key(function(d) { return d.x; }).sortKeys(d3.ascending) 
    .entries(data);
    
	//Create tree data structure
	var dataNest = d3.nest()
		.key(function(d) { return d.y; }).sortKeys(d3.ascending)
		.key(function(d) { return d.x; }).sortKeys(d3.ascending)
		//***************NEED TO CHANGE THIS TO SORT BY ASCENDING LAUNCH DATE******************
    .sortValues(function(d1,d2) { return d3.ascending(-d1.z,-d2.z); }) //sorting from highest to lowest
		.entries(data);

  var spam = d3.nest()
    .key(function(d) { return parseFloat(-d.z); }).sortKeys(d3.ascending)
    .entries(data);
	    
	//Set the x- and y-axis domains
  xScale.domain(x_list.map(function(d) { return d.key; }));
  yScale.domain(y_list.map(function(d) { return d.key; }));

	//Write the y-axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", "-135px")
      .attr("x", -height/2 + "px")
      .text("TA");

	//Write the x-axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("y", "45px")
      .attr("x", width/2 + "px")
      .text("Phase");
      
 //Create the x-grid
  var xgrid = svg.selectAll('.xgrid').data(x_list.map(function(d) { return d.key; })); 

  xgrid.enter().append('line');
  xgrid.exit().remove();
	
	//We're drawing straight vertical lines that span the height of the graph (yScale.rangeExtent) and hit the points between each bucket
  xgrid.attr('class','xgrid')
      .attr('x1', function(d){
          return xScale(d) + xScale.rangeBand();})  //The "0" x-axis element is the y-axis, so we don't need a grid there. Thus, offset by 1 rangeBand.
      .attr('x2', function(d){
          return xScale(d) + xScale.rangeBand();})  //The "0" x-axis element is the y-axis, so we don't need a grid there. Thus, offset by 1 rangeBand.
      .attr('y1', yScale.rangeExtent()[0])
      .attr('y2', yScale.rangeExtent()[1]);

 //Create the y-grid
  var ygrid = svg.selectAll('.ygrid').data(y_list.map(function(d) { return d.key; })); 

  ygrid.enter().append('line');
  ygrid.exit().remove();

	//We're drawing straight horizontal lines that span the height of the graph (xScale.rangeExtent) and hit the points between each bucket
  ygrid.attr('class','ygrid')
      .attr('y1', function(d){
          return yScale(d);})   //The first y-grid should be the top of the graph, so no offset
      .attr('y2', function(d){
          return yScale(d);})
      .attr('x1', xScale.rangeExtent()[0])
      .attr('x2', xScale.rangeExtent()[1]);

	//Calculate the maximum number of projects in any x-y (e.g. TA-Phase) combo.
	//NB: You can't have multiple rollups within a nest, nor can you aggregate a level underneath a rollup. The solution is to create a key that is the unique x-y (e.g. TA-Phase) combo, then max across it.
	var maxProjArray = d3.nest()
		.key(function(d) { return d.y + '' + d.x; }).sortKeys(d3.ascending)
		.rollup(function(leaves) { return leaves.length;})
		.entries(data);
		//This is the maximum number of projects in any x-y (e.g. TA-Phase) bucket
		var maxProjs = d3.max(maxProjArray, function(d) { return d.values; });	
		
	//Get # of x and y elements (e.g. TAs and Phases)
	var numXs = xScale.domain().length; 
	var numYs = yScale.domain().length; 
	
	//Determine how many pixels of "personal space" each bubble will get
	var bubble_padding = 5; //Amount of space between the bubbles and the axes.
	var xSpace = (xScale.rangeBand() - bubble_padding*(maxProjs+1))/maxProjs; //bubble_padding is the space between bubbles and between the bubbles and the axes; more padding means smaller bubble size
	var maxR = Math.min(xSpace,(yScale.rangeBand()-2*bubble_padding))/2; //The maximum diameter of a bubble is the lesser of row height and horizontal space allocated to each bubble
	
 	//variables for scaling the z-axis of the bubbles
  var max_size = maxR;
	var min_size = 3;
	var max_z = d3.max(data, function(d) { return d.z; });
	var min_z = d3.min(data, function(d) { return d.z > 0 ? d.z : max_z; });
	
	// append the bubbles
	//the top-level variables contains the y, then the x, then the projects
	var y_var = svg.selectAll("g.y_class")
			.data(dataNest)
		.enter()
			.append("g")
			.attr("class","y_class");

		//this is one level down
		var x_var = y_var.selectAll("g.x_class")
				.data(function (d) { return d.values;})
			.enter()
				.append("g")
				.attr("class","x_class");
		
			//this is two levels down
			  x_var.selectAll(".dot")
	  	  		.data(function (d) { return d.values;})
			    .enter()
			    	.append("circle")
			      .attr("class", "dot")
			      .attr("cx", function(d, i) { return xScale(d.x) + (xSpace + bubble_padding)*(i + 0.5); })  //Positioning the bubbles horizontally on the left, centered in their own personal space
			      .attr("cy", function(d) { return yScale(d.y) + yScale.rangeBand()/2; })  //Positioning the bubbles vertically in the middle of the box	
			      .attr("r", function(d) {
			      	if (max_z === min_z) {return max_size;} else //If all bubbles are the same, don't bother with math
			      		{if (d.z < 0) {return min_size;} else {return (d.z-min_z)/(max_z-min_z)*(max_size-min_size)+min_size;};} 
			      	}) //Taking the squares of the bubble sizes (to reflect area) and normalizing to min & max values
			      .style("fill", function(d) { return color(d.sb); })
			      .append("svg:title")
			      .text(function(d) { return d.names; });

	//draw the legendy thing  
  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(100," + i * 25 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

});
