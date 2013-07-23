$(document).ready(function() {
  //set default value
  $("#pulldown_layout option:contains('"+layout_choice+"')").attr("selected", "selected"); //in the drop-down, select the default selection

  //doing this because the .on("change", change_layout) doesn't seem to be working
  $("#pulldown_layout").change(function() {
    layout_choice = $(this).val();
    //reDraw();
    doTheLayout();
    $(".y.axis").remove();
    $(".x.axis").remove();
    doTheAxes();
  });
});

//Indices that we'll need to pull from Analytica
var tasIndex = ["CNS","Dermatology","Endocrine Disorder","Immunology","Ophthalmology"];
var statusesIndex = ["ACTIVE","AUTHORIZED","PLANNED"];
var bucketsIndex = ["Potential","Considered","Committed"];
var phasesIndex = ["Preclinical","Phase 1","Phase 2","Phase 3","NDA"];
var compoundsIndex = ["ATH-235","CNS-025","CNS-072","CNS-534","CNS-612","CNS-785","CNS-956","CNS-989","ENDC-522","ENDC-560","ENDC-867","ENDC-920","IMM-060","IMM-165","IMM-211","IMM-455","OPTH-001","OPTH-244"];
var indicationsIndex = ["Acne","Acute Migraine","Acute Pain","Alopecia","Alzheimer's disease","Ankylosing Spondylitis","Anxiety Disorder","Cognitive Impairment","Diabetes Mellitus","Diabetic Nephropathy","Glaucoma","Goiter","Lambert-Eaton Syndrome","Muscular Disorder","Myxedema","Psoriasis","Rheumatoid Arthritis","Sjogren's Sydrome","Smoking Cessation","Thyroid nodules"];
var titles = [{"tas":"TA"},{"statuses":"Status"},{"buckets":"Strategic Bucket"},{"phases":"Phase"},{"compounds":"Compound"},{"indications":"Indication"}];

//delcare global variables for data. this way when they get updated the data will be available globally
var x_list = [];
var y_list = [];
var cFill_list = [];

//Set the margins for the chart
var margin = {top: 50, right: 150, bottom: 80, left: 150},
    width = 1080 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

//Using the basic d3 colors
var color = d3.scale.category10();

//Create an object in the DOM before the svg object on which to latch on our pulldowns
var pulldownrow = d3.select("body").append("div")
  .attr("class", "pulldownrow");

//Build the layout selector
var layout_data =[];
var layout_choices = [{"Pipeline Balance": {x:"phases",y:"tas",z:"enpvs",cFill:"buckets"}},
                    {"Compound-Indications":{x:"compounds",y:"indications",z:"npvs",cFill:"tas"}},
                    {"Alignment":{x:"statuses",y:"buckets",z:"npvs",cFill:"phases"}}];

var layout_choice = "Compound-Indications"; //"Pipeline Balance"; //Text string of selected option

//build the drop-down for choosing the layout
var layout_dropdown = d3.select(".pulldownrow")
  //add label
  .append("div")
    .attr("class", "pulldownlabel")
    .text("Choose Layout: ")
  //add drop-down
  .append("select")
    .attr("id", "pulldown_layout");
    //.on("change", change_layout) doesn't seem to be applying, so doing in jquery

//add options to dropdown
var layout_options =  layout_dropdown.selectAll("option")
  .data(doTheLayout("strings"))
  .enter()
    .append("option")
    .attr("class", "pulldownoption")
    .text(function(d){ return d; });


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

//pick the layout you want. parameters: "strings" returns an array of strings representing layout choices. "data" returns the x,y,z,colorfill data. A null parameter returns nothing; it simply invokes a new layout.
function doTheLayout(returnMe) {
  layout_data = layout_choices.filter(function(d,i) {return layout_choices[i][layout_choice] !== undefined;})[0][layout_choice];  //The x,y,z,fill for the selected layout
  var layout_strings = []; //layout_strings is an array of the layout options as text strings
  for(i=0;i<layout_choices.length;i++) {
    layout_strings[i] = d3.keys(layout_choices[i]);
  }
  if (returnMe==='strings') {return layout_strings;} else {if (returnMe ==='data') {return layout_data;}}
}

//Takes x, y, z, cFill (as strings), returns that index for the selected layout.
function getSelectedIndex(n) {
  return eval(layout_data[n]+"Index");
}

function doTheAxes() {
    x_list = getSelectedIndex("x");//phasesIndex.reverse();
    y_list = getSelectedIndex("y");//tasIndex;
    cFill_list = getSelectedIndex("cFill");

    //Set the x- and y-axis domains
    xScale.domain(x_list.map(function(d) { return d; }));
    yScale.domain(y_list.map(function(d) { return d; }));

    //Write the y-axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", "-135px")
        .attr("x", -height/2 + "px")
        .text(titles.filter(function(d,i) {return titles[i][layout_data["y"]] !== undefined;})[0][layout_data["y"]]);

    //Write the x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .append("text")
        .attr("class", "label")
        .attr("y", "45px")
        .attr("x", width/2 + "px")
        .text(titles.filter(function(d,i) {return titles[i][layout_data["x"]] !== undefined;})[0][layout_data["x"]]);

   //Create the x-grid
    var xgrid = svg.selectAll('.xgrid').data(x_list.map(function(d) { return d; }));

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
    var ygrid = svg.selectAll('.ygrid').data(y_list.map(function(d) { return d; }));

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
}

function doTheLegend() {
  //draw the legendy thing
  var legend = svg.selectAll(".legend")
      .data(cFill_list)
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
}

//This is what you call when you want to re-draw the graph
function doTheD3() {

  var myLayout = doTheLayout("data");

  //Get the data and start drawing
  d3.csv("bingo_data.csv", function(error, data) {
    data.forEach(function(d) {
      d.names = d.names;
      d.y = d[myLayout.y];
      d.x = d[myLayout.x];
      d.z = +d[myLayout.z];
      d.cfill = d[myLayout.cfill];
    });

    //Create tree data structure
    var dataNest = d3.nest()
      .key(function(d) { return d.y; }).sortKeys(d3.ascending)
      .key(function(d) { return d.x; }).sortKeys(d3.ascending)
      //***************NEED TO CHANGE THIS TO SORT BY ASCENDING LAUNCH DATE******************
      .sortValues(function(d1,d2) { return d3.ascending(-d1.z,-d2.z); }) //sorting from highest to lowest
      .entries(data);

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
                  {if (d.z < 0) {return min_size;} else {return (d.z-min_z)/(max_z-min_z)*(max_size-min_size)+min_size;}}
                }) //Taking the squares of the bubble sizes (to reflect area) and normalizing to min & max values
              .style("fill", function(d) { return color(d.cfill); })
              .append("svg:title")
              .text(function(d) { return d.names; });
  });
}

doTheAxes();
doTheD3();
doTheLegend();

function reDraw() {
  var transition = svg.transition().duration(750);

  //doTheLegend();
  doTheAxes();
  /*
  transition.select(".x_axis")
    .call(xAxis);
  */
};