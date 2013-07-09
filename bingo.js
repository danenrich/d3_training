/*global portviz:false, d3:false, _:false */
(function() {
/*
 * a bingo chart plots category populations for
 * two categories.
 */
 this.bingo = function() {
  var width = 720;
  var height = 445;
  var xlabel = '';
  var ylabel = '';
  var my = function(selection) {
    var innerwidth = width - portviz.margins.left - portviz.margins.right;
    var innerheight = height - portviz.margins.top - portviz.margins.bottom;
    /*
     * @param d 
     *    [
     *        {
     *          portname: portfolio name,
     *          portdata: {
     *                  x: [x,x,x,...],   // (category)
     *                  y: [y,y,y,...],   // (category)
     *                  data: [{x:x, y:y, label: label (project name)}, ...]
     *          }
     *        }, ...
     *    ]
     */
    selection.each(function(ppdata) {
        var allx = [];
        var ally = [];

        // group the data with common categories.
        // TODO: better key generation
        //{phase::ta, [{x,y,label,i},...], phase::ta, []}
        var allpoints = [];
        // max per group
        var maxpop = 0;
        _.each(ppdata, function(ppd, ppdindex) {
            var grouped = {};
            allx = _.union(allx, ppd.portdata.x);
            ally = _.union(ally, ppd.portdata.y);
            _.each(ppd.portdata.data, function(d) {
                var key = d.x + '::' + d.y;
                if (_.isUndefined(grouped[key])) grouped[key] = 0;
                var i = grouped[key];
                var exd = _.extend(d, {
                    i:i,
                    j:ppdindex,
                    portname: ppd.portname,
                    key: ppd.portname + '::' + d.label
                    });
                grouped[key] ++ ;
                allpoints.push(exd);
                maxpop = _.max([maxpop, grouped[key]]);
            });
        });

        var padding = 0.1;
        var xscale = d3.scale.ordinal()
            .domain(allx)
            .rangeRoundBands([0, innerwidth], padding);
        var yscale = d3.scale.ordinal()
            .domain(ally)
            .rangeRoundBands([0, innerheight], padding);

        var colorScale = d3.scale.category10().domain(_.range(100));

        var xaxis = portviz.charts.xaxis()
            .width(width).height(height)
            .label(xlabel)
            .scale(xscale);

        var yaxis = portviz.charts.yaxis()
            .width(width).height(height)
            .label(ylabel)
            .scale(yscale);

        d3.select(this).selectAll('table').remove();
        d3.select(this).selectAll('div.tab-content').remove();
        d3.select(this).selectAll('svg.stacked-bar-line').remove();
        d3.select(this).selectAll('svg.linechart').remove();
        d3.select(this).selectAll('svg.scatter').remove();
        d3.select(this).selectAll('svg.barchart').remove();

        var svg = d3.select(this).selectAll('svg').data(['hi']);

        svg.enter().append('svg');
        svg.exit().remove();

        svg.attr('width', width)
            .attr('height', height)
            .attr('class', 'bingochart');

        var gg = svg.selectAll('g.chartcontainer').data(['hi']);

        gg.enter().append('g');
        gg.exit().remove();

        gg.attr('class','chartcontainer')
            .attr('transform', 'translate(' + portviz.margins.left + ',' + portviz.margins.top + ')');

        gg.call(xaxis);
        gg.call(yaxis);


        // horizontal grid
        var xgrid = gg.selectAll('.xgrid').data(allx);

        xgrid.enter().append('line');
        xgrid.exit().remove();

        xgrid.attr('class','xgrid')
            .attr('x1', function(d){
                return xscale(d) + xscale.rangeBand() * (1 + padding / 2);})
            .attr('x2', function(d){
                return xscale(d) + xscale.rangeBand() * (1 + padding / 2);})
            .attr('y1', yscale.rangeExtent()[0])
            .attr('y2', yscale.rangeExtent()[1]);

        // vertical grid
        var ygrid = gg.selectAll('.ygrid').data(ally);

        ygrid.enter().append('line');
        ygrid.exit().remove();

        ygrid.attr('class','ygrid')
            .attr('y1', function(d){
                return yscale(d) - yscale.rangeBand() * ( padding / 2);})
            .attr('y2', function(d){
                return yscale(d) - yscale.rangeBand() * ( padding / 2);})
            .attr('x1', xscale.rangeExtent()[0])
            .attr('x2', xscale.rangeExtent()[1]);


        // points
        var sss = gg.selectAll('a.dot')
            .data(allpoints, function(d){ return d.key; });

        sss.enter().append('a');
        sss.exit().remove();

        sss.attr('class','dot bingo');

        var ssc = sss.selectAll('circle').data(function(d){return [d];});
        ssc.enter().append('circle')
            .attr('cx', function(d) {
                return xscale(d.x) + xscale.rangeBand() * (d.i * 2 + 1) / (maxpop * 2);
            })
            .attr('cy', function(d) {
                return yscale(d.y) + yscale.rangeBand() * (d.j * 2 + 1) / (ppdata.length * 2);
            });

        ssc.exit().remove();

        var xspacing = innerwidth / (maxpop * allx.length);
        var yspacing = innerheight / (ppdata.length * ally.length);
        var radius = 0.8 * _.min([xspacing,yspacing]) / 2;

        ssc.transition()
            .attr('cx', function(d) {
                return xscale(d.x) + xscale.rangeBand() * (d.i * 2 + 1) / (maxpop * 2);
            })
            .attr('cy', function(d) {
                return yscale(d.y) + yscale.rangeBand() * (d.j * 2 + 1) / (ppdata.length * 2);
            })
            .attr('r', radius)
            .attr('fill', function(d) {
                return colorScale(d.j);
            })
            .attr('name', function(d) {return d.label;})
            .attr('opacity', 1);

        sss.call(portviz.charts.tooltip(gg, function(dl){return dl.label + '(' + dl.portname + ')';})
          .width(innerwidth)
          .height(innerheight));

    });
  };
  my.width = function(v) {
      if (!arguments.length) return width;
      width = v;
      return my;
  };
  my.height = function(v) {
      if (!arguments.length) return height;
      height = v;
      return my;
  };
  my.xlabel = function(v) {
      if (!arguments.length) return xlabel;
      xlabel = v;
      return my;
  };
  my.ylabel = function(v) {
      if (!arguments.length) return ylabel;
      ylabel = v;
      return my;
  };
  return my;
 };

}).apply(portviz.charts);
