// stash the d3 views here until i can look closer at it.

App.gaussRandom = function gaussRandom() {
    var u = 2*Math.random()-1;
    var v = 2*Math.random()-1;
    var r = u*u + v*v;
    if(r == 0 || r > 1) return App.gaussRandom();
    var c = Math.sqrt(-2*Math.log(r)/r);
    return u*c;
}

App.datamaker = function() {
    //this would come from the server in the real case
    var data = []
    var td = new Date()
    var yd = 0
    for (i = 0; i < 50; ++i) {
        td = new Date(td.getTime() + 60000);
        
        yd = yd + App.gaussRandom();
        data.push({x:td, y:yd, color: (i % 2 ? "red" : "green")})
    }
    return data;
}

// data: x,y,color,message,id,endtime
App.timeseriesplot2 = function(totalwidth, totalheight, data, selection) {


  // dates
  data.sort(function(a,b) {
    if (a.x > b.x) return 1;
    if (a.x < b.x) return -1;
    return 0;
  });

  //console.log(data);

  var swim = []

  data.map(function(d) {
      //console.log('start ' + d.x)
      //console.log('end ' + d.endtime)
    //console.log('open lane?')
    for (i=0; i< swim.length; ++i) {
      //console.log('lane ' + i)
      var ith = swim[i]
      //console.log(ith[ith.length-1].endtime)
      if (ith[ith.length-1].endtime < d.x) {
          //console.log('yes, lane '+ i)
          // i am cheating here
          d.lane = i
        ith.push(d)
        return;
      }
    }
    //console.log('nope, make new lane.')
    var newlane = []
    d.lane = swim.length
    newlane.push(d)
    swim.push(newlane)

  });

  //console.log(swim);

  // now we have some swim lanes to plot.

    var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40
    };

    var width = totalwidth - margin.left - margin.right;
    var height = totalheight - margin.top - margin.bottom;

   

  var xmin = d3.min(data, function(d) {
      return d.x
  });
  var xmax = d3.max(data, function(d) {
      return d.endtime;
  });

  //console.log(xmin)
  //console.log(xmax)
  //console.log(swim.length)


  var xscale = d3.time.scale().domain([xmin, xmax]).range([0, width]);
  var yscale = d3.scale.linear().domain([0, swim.length]).range([height, 0]);

  //console.log(xscale(xmin))
  //console.log(yscale(0))
  //console.log(yscale(swim.length - 10))

  var xAxis = d3.svg.axis().scale(xscale).orient('bottom').ticks(12).tickPadding(10);
  var yAxis = d3.svg.axis().scale(yscale).orient('left').ticks(swim.length).tickPadding(10);

  var fmt = d3.time.format("%H:%M:%S")

  var svg = selection.append("div")
      .append('svg')
      //.datum(data)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

  svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis);

  svg.selectAll('.swimmer')
    .data(data)
    .enter()
    .append('a')
    .attr('href', function(d){ return '#' + d.id; })
    .attr('data-toggle','modal')
    .attr('rel','tooltip')
    .attr('title',function(d){ return fmt(d.x) + ' - ' + fmt(d.endtime)})
    .attr('class', 'swimmer')
    .append('rect')
    .attr('x', function(d){ return xscale(d.x); } )
    .attr('y', function(d){ return yscale(d.lane + 1); } )
    .attr('width', function(d) { return xscale(d.endtime) - xscale(d.x); } )
    .attr('height', height / swim.length * 0.5)
    .attr("stroke", function(d){ return d.color})
    .attr("fill", function(d){ return d.color});

    return selection.html()

}

// data: x,y,color,message,id
App.timeseriesplot = function(totalwidth, totalheight, data, selection) {



    var margin = {
        top: 10,
        right: 10,
        bottom: 20,
        left: 40
    };

    var width = totalwidth - margin.left - margin.right;
    var height = totalheight - margin.top - margin.bottom;

   

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


  var xscale = d3.time.scale().domain([xmin, xmax]).range([0, width]);
  var yscale = d3.scale.linear().domain([ymin, ymax]).range([height, 0]);

  var xAxis = d3.svg.axis().scale(xscale).orient('bottom').ticks(12);
  var yAxis = d3.svg.axis().scale(yscale).orient('left').ticks(5);

  var line = d3.svg.line().x(function(d) {
    return xscale(d.x);
  }).y(function(d) {
    return yscale(d.y);
  });

  var svg = selection.append("div")
      .append('svg')
      .datum(data)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  svg.append('g').attr('class', 'x axis').attr('transform',
      'translate(0,' + height + ')').call(xAxis);

  svg.append('g').attr('class', 'y axis').call(yAxis);

  // just do scatter
  // svg.append('path').attr('class', 'line').attr('d', line);

  svg.selectAll('.dot')
    .data(data)
    .enter()
    .append('a')
    .attr('href', function(d){ return '#' + d.id; })
    .attr('data-toggle','modal')
    .append('circle')
    .attr('class', 'dot')
    .attr('cx', line.x())
    .attr('cy', line.y())
    .attr('r', 4)
    .attr("stroke", function(d){ return d.color})
    .attr("fill", function(d){ return d.color});

    return selection.html()

}


App.simpleplot = function(selection) {

  //this would come from the server in the real case
    var data = []

    var margin = {
        top: 10,
        right: 10,
        bottom: 20,
        left: 40
    };
    var width = 800 - margin.left - margin.right;
    var height = 300 - margin.top - margin.bottom;

    var d = 0
    for (i = 0; i < width; ++i) {
        d = d + App.gaussRandom();
        data.push({x:i, y:d})
    }

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

  var svg = selection.append("div").attr('class','simpleplot').append('svg').datum(data).attr('width',
      width + margin.left + margin.right).attr('height',
      height + margin.top + margin.bottom).append('g').attr('transform',
      'translate(' + margin.left + ',' + margin.top + ')');

  svg.append('g').attr('class', 'x axis').attr('transform',
      'translate(0,' + height + ')').call(xAxis);

  svg.append('g').attr('class', 'y axis').call(yAxis);

  svg.append('path').attr('class', 'line').attr('d', line);

  svg.selectAll('.dot').data(data).enter().append('circle').attr('class',
      'dot').attr('cx', line.x()).attr('cy', line.y()).attr('r', 3.5);

    return selection.html()

}

// this is not an underscore template, it's a d3 plot
App.PlotView = Backbone.View.extend({
    initialize: function () {
        this.render();
    },
    render: function (eventName) {
        //console.log("plot view render")
        this.$el.html(App.simpleplot(d3.select(this.el)));
        return this;
    },
    remove: function() {
        //console.log("plot view remove")
        this.$el.empty();
        this.unbind();
    }
});

// gets a 'model' in the initializer
App.TimeSeriesPlotView = Backbone.View.extend({
    initialize: function () {
        this.render();
    },
    render: function (eventName) {
        //console.log("time series plot view render width " + this.$el.width())
        var data = this.model.map(function(d) {
            var att = d.attributes
            return {x: att.start_time,
                    y: ((att.end_time.getTime() - att.start_time.getTime())/1000),
                    color: (att.status == 200 ? "green" : "red"),
                    message: att.message,
                    id: att.id,
                    endtime: att.end_time
                    }

        });
        this.$el.html(App.timeseriesplot2(this.$el.width(), 150, data, d3.select(this.el)));
        return this;
    },
    remove: function() {
        //console.log("time series plot view remove")
        this.$el.empty();
        this.unbind();
    }
});

