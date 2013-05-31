// d3 rendering functions
// 
// takes the place of the 'template' notion.
// no backbone here, and no state neither.

App.format = d3.time.format("%c");
App.logo = '../images/enrich_smaller.gif'
App.copyimg = '../images/copy.gif'
App.trashimg = '../images/del.gif'

App.deleteModal = function(sel, id, title) {
    sel.append('a')
        .attr('href','#confirm_delete'+id)
        .attr('rel','tooltip')
        .attr('data-placement','right')
        .attr('title','delete ' + title)
        .attr('data-toggle','modal')
        .append('i')
        .attr('class','icon-trash');
    var modal = sel.append('div')
        .attr('class','modal hide fade')
        .attr('id','confirm_delete'+id)
        .attr('tabindex','-1')
        .attr('aria-hidden','true')
        .attr('role','dialog')
        .attr('aria-labelledby','label' + id);
    modal.append('div')
        .attr('class','modal-body')
        .html('really delete ' + title  + ' ' + id + '?');
    var mf = modal.append('div')
        .attr('class','modal-footer');
    mf.append('button')
        .attr('class','btn')
        .attr('data-dismiss','modal')
        .html('No, wait!')
    mf.append('button')
        .attr('class','btn btn-primary delete')
        .attr('id','delete'+id)
        .attr('data-dismiss','modal')
        .html('Yes, kill it!');
};

App.UserRowRender = function(sel, item) {
    var tr = sel.append('tr');
    tr.append('td').html(item.user_id)
    tr.append('td').html(item.name)
};

// add the cell, return, and fill in the value asynchronously
App.UserCellRender = function(tr, id) {
    var usercell = tr.append('td');
    // TODO: cancel this callback when the view is removed.
    App.users.defer(function(list) {
        return function() {
            var creator = list.get(id)
            usercell.html(_.isUndefined(creator) ? 'user'+id : creator.get('name'));
        };
    });
};

// sel = d3 selection, item = backbone model
App.ProjRowRender = function(sel, item, metaModel) {
    var tr = sel.append('tr')
    //var td = tr.append('td')
    //App.deleteModal(td, item.get('project_id'), 'project')
    //td.append('a')
    //    .attr('href','#projects/' + item.get('project_id'))
    //    .html(item.get('project_id'));
    tr.append('td').append('a')
        .attr('href','#projects/' + item.get('project_id'))
        .html(item.get('name'));

    //App.UserCellRender(tr, item.get('creator_id'));

    //tr.append('td').html(App.format(item.get('create_time')))
    //tr.append('td').append('a')
    //    .attr('href','#projects/' + item.get('project_id') + '/snapshots')
    //    .html('snapshots')

    _.each(
        _.sortBy(
            metaModel.filter(
                function(x){return App.listfilter(x) > 0;}),
            function(x){return App.listsort(x);}),
        function(x) { tr.append('td').html(App.FancyAttValue(x, item));});

    tr.append('td').html(
        _.isNaN(item.get('last_publication').getTime()) 
        ? 'n/a' 
        : App.format(item.get('last_publication')) 
    )
};

App.ProjCreateUrl = '../projcreate.aspx';
App.ProjCreatePidUrl = function(item) { return App.ProjCreateUrl + '?projid=' + item.get('project_id') };

// sel = d3 selection, item = backbone model
App.ProjMgmtRowRender = function(sel, item, metaModel) {
    var tr = sel.append('tr')
    //var td = tr.append('td')
    //App.deleteModal(td, item.get('project_id'), 'project')
    //td.append('a')
    //    .attr('href','#projects/' + item.get('project_id'))
    //    .html(item.get('project_id'));
    tr.append('td').append('a')
        .attr('href',App.ProjCreatePidUrl(item))
        .html(item.get('name'));

    App.UserCellRender(tr, item.get('creator_id'));

    //tr.append('td').html(App.format(item.get('create_time')))
    //tr.append('td').append('a')
    //    .attr('href','#projects/' + item.get('project_id') + '/snapshots')
    //    .html('snapshots')

    _.each(
        _.sortBy(
            metaModel.filter(
                function(x){return App.mgmtfilter(x) > 0;}),
            function(x){return App.mgmtsort(x);}),
        function(x) { tr.append('td').html(App.FancyAttValue(x, item));});
    tr.append('td').html(item.get('active')?'Active':'Inactive')
    tr.append('td').attr('class','center').append('a').attr('href','foo').append('img').attr('src', App.copyimg)
    tr.append('td').attr('class','center').append('a').attr('href','foo').append('img').attr('src', App.trashimg)

    //tr.append('td').html(
    //    _.isNaN(item.get('last_publication').getTime()) 
    //    ? 'n/a' 
    //    : App.format(item.get('last_publication')) 
    //)
};

// sel = d3 selection, item = backbone model
App.PortRowRender = function(sel, item, metaModel) {
    var tr = sel.append('tr');
    tr.attr('class', item.get('populated') ? 'success' : 'error')
    var td = tr.append('td')
    App.deleteModal(td, item.get('portfolio_id'), 'portfolio')
    td.append('a')
        .attr('href','#portfolios/' + item.get('portfolio_id'))
        .html(item.get('portfolio_id'));
    tr.append('td')
        .append('a')
        .attr('href','#portfolios/' + item.get('portfolio_id'))
        .html(item.get('name'));

    App.UserCellRender(tr, item.get('creator_id'));

    tr.append('td').html(App.format(item.get('create_time')));
    tr.append('td').html(item.get('populated'));
    tr.append('td').append('a')
        .attr('href','#portfolios/' + item.get('portfolio_id') + '/snapshots')
        .html('snapshots');

    _.each(
        _.sortBy(
            metaModel.filter(
                function(x){return x.get('list_view') > 0;}),
            function(attr){return attr.get('list_view');}),
        function(x) {tr.append('td').html(App.FancyAttValue(x, item));});
};

/**
 * @param {backbone-model} item
 */
App.SnapRowRender = function(sel, item) {
    var tr = sel.append('tr');
    tr.attr('class', item.get('failed') ? 'error' : (item.get('populated') ? 'success' : 'warning'))
    var td = tr.append('td')
    App.deleteModal(td, item.get('snapshot_id'), 'snapshot')
    td.append('a')
        .attr('href','#snapshots/' + item.get('snapshot_id'))
        .html(item.get('snapshot_id'));
    tr.append('td').append('a')
        .attr('href','#snapshots/' + item.get('snapshot_id'))
        .html(item.get('snapshot_name').substring(0,30));
     
    App.UserCellRender(tr, item.get('creator_id'));

    tr.append('td').append('a')
        .attr('href','#projects/' + item.get('project_id'))
        .html(item.get('project_id'));
    tr.append('td').html(item.get('approved'));
    tr.append('td').html(App.format(item.get('creation_time')));
    tr.append('td').html(App.format(item.get('refresh_time')));
    tr.append('td').html(item.get('populated'));
    tr.append('td').html(item.get('failed'));
    tr.append('td').append('a')
        .attr('href','#snapshots/' + item.get('snapshot_id') + '/refreshes')
        .html('refreshes');
};

App.VarRowRender = function(sel, item) {
    var tr = sel.append('tr');
    tr.append('td').append('a').attr('href','#snapshots/'+item.snapshot_id).html(item.snapshot_id);
    tr.append('td').html(item.variable_name);
    tr.append('td').html(item.variable_type);
    tr.append('td').append('a').attr('href',item.uri).html('link');
};

// see Attributes.vb.
// pa = attr metadata backbone model, item = row backbone model
App.FancyAttValue = function(pa, item) {
    var attr = item.get('attributes')[pa.get('id')];
    if (_.isUndefined(attr)) {
        return 'n/a';
    } else if (pa.get('type') == 'users') {
        if (attr.att_value == '') {
            return 'n/a';
        };
        var creator = App.usersList.get(attr.att_value)
        if (_.isUndefined(creator)) {
            return 'n/a';
        };
        return creator.get('name');
    } else if (pa.get('type') == 'pulldown') {
        var po = _.find(pa.get('options'), function(x) {return x.id == attr.att_value; } );
        if (_.isUndefined(po)) {
            return 'n/a';
        }
        return po.name;
    } else if (pa.get('type') == 'sub_project') {
        return 'TODO: subproject name';
    } else {
        return attr.att_value;
    };

};
App.RefreshRowRender = function(sel, item) {
    var tr = sel.append('tr').attr('class',(item.status == 500)?'error':((item.status == 200)?'success':''));
    var td = tr.append('td')
    App.deleteModal(td, item.snapshot_id, 'snapshot')
    td.append('a')
        .attr('href','#snapshots/' + item.snapshot_id)
        .html(item.snapshot_id);
    tr.append('td').html(item.source.substring(0,30));
    tr.append('td').html(App.format(item.start_time));
    tr.append('td').html(App.format(item.end_time));
    tr.append('td').html((item.end_time.getTime() - item.start_time.getTime())/1000);
    tr.append('td').html(item.status);
    var msgtd = tr.append('td');
    msgtd.append('a').attr('href','#'+item.id).attr('data-toggle','modal').html(item.message.substring(0,30));
    var modal = sel.append('div')
        .attr('class','modal hide fade')
        .attr('id',item.id)
        .attr('tabindex','-1')
        .attr('aria-hidden','true')
        .attr('role','dialog')
        .attr('aria-labelledby','label' + item.id);
    var mh = modal.append('div').attr('class','modal-header');
    mh.append('button').attr('type','button').attr('class','close')
        .attr('data-dismiss','modal').attr('aria-hidden','true')
        .html('x');
    mh.append('h3').attr('id','label'+item.id).html('Refresh ' + item.id)
    modal.append('div').attr('class','modal-body').html(item.message);
    modal.append('div').attr('class','modal-footer')
        .append('button').attr('class','btn').attr('data-dismiss','modal').attr('aria-hidden','true')
        .html('Close');
};

App.ColHead = function (model, sel, col) {
    var btn = sel.append('button')
        .attr('class', 'btn btn-link sort')
        .attr('value', col)
        .append('strong')
        .html(col)
    if (model.sortField === col) { 
        if (model.sortDir === "asc") {
            sel.append('i').attr('class','icon-chevron-up')
        } else {
            sel.append('i').attr('class','icon-chevron-down')
        }
    } 
};

// every filter has a name field ... hm.
App.filterName = function(fltform) {
    console.log('filtername');
    var c1 = fltform.append('div').attr('class','control-group')
    var l1 = c1.append('label').attr('class','control-label').html('Name')
    var cc1 = c1.append('div').attr('class','controls')
    cc1.append('input').attr('type','text').attr('name','name').attr('class','span3')
};

App.filterRow = function(fltform, attr) {
    var c2 = fltform.append('div').attr('class','control-group')
    c2.append('label').attr('class','control-label').html(attr.get('name'))
    var cc2 = c2.append('div').attr('class','controls');
    return cc2;
};

// append filter elements for one attr.
// fltform = d3 selection
// attr = attribute object
App.filter = function(fltform, attr) {
    if (attr.get('filter')) {
        if (attr.get('type') == 'pulldown') {
            var cc2 = App.filterRow(fltform, attr)
            var select = cc2.append('select').attr('name', attr.get('id')).attr('class','span3')
            if (attr.get('options')) {
                var opts = _.sortBy(
                    attr.get('options'),
                    function(opt){return opt.id;});
                // TODO: make the "nothing" option clearer
                opts.unshift({id:"",name:""});
                var sd = select.selectAll('option').data(opts)
                sd.enter()
                    .append('option')
                    .attr('value',function(opt){return opt.id})
                    .html(function(opt){return opt.name})
            }
        } else if (attr.get('type') == 'users') {
            var cc2 = App.filterRow(fltform, attr)
            // the binding works ok as long as i have this named element done; the option values can wait.
            var select = cc2.append('select').attr('name', attr.get('id')).attr('class','span3');
            App.users.defer(function(list){
                return function() {
                    var users = 
                        list
                        .map(function(x) {return x.toJSON();});
                    // TODO: make the "nothing" option clearer
                    users.unshift({user_id:"",name:""});
                    var sd = select.selectAll('option').data(users)
                    sd.enter()
                        .append('option')
                        .attr('value',function(d){return d.user_id;})
                        .html(function(d){return d.name;})
                };
            });
        } else if (attr.get('type') == 'shorttext') {
            var cc2 = App.filterRow(fltform, attr)
            cc2.append('input').attr('type','text').attr('name',attr.get('id')).attr('class','span3')
        } else {
            console.log('WARN: skipping attr ' +  attr.get('id'))
        }
    }
};

// startRow is zero-based inclusive
// endRow is zero-based exclusive
App.pagination = function(sel, model) {
    var thediv = sel
        .append('div').attr('class','table_control')
        .append('div').attr('class','row-fluid')
        .append('div').attr('class','pages pull-right');
    if (model.totalRows > 0) {
        thediv.html(' ' + (model.startRow + 1) + ' - ' + model.endRow + ' of ' +  model.totalRows + ' ');
        var p = thediv.append('button').attr('class','btn prev');
        if (model.startRow <= 1) p.attr('disabled','')
        p.append('i').attr('class','icon-chevron-left');
        var n = thediv.append('button').attr('class','btn next');
        if (model.endRow >= model.totalRows) n.attr('disabled','');
        n.append('i').attr('class','icon-chevron-right');
    } else {
        thediv.html('No results')
    }
};

App.tbl = function(sel) {
    var tbl = sel.append('div').attr('class','row-fluid')
        .append('div').attr('class','span12')
        .append('div').attr('class','well')
        .append('table').attr('class','table table-hover table-condensed table-striped table-bordered');
    return tbl;
};

App.RefreshListRender = function(el, model) {
    var sel = d3.selectAll(el);
    sel.append('div').attr('class','row-fluid')
        .append('div').attr('class','span12 table_plot well')
    App.pagination(sel, model);
    var tbl = App.tbl(sel);

    var thr = tbl.append('thead').append('tr');
    App.ColHead(model, thr.append('th'), "snapshot_id");
    App.ColHead(model, thr.append('th'), "source");
    App.ColHead(model, thr.append('th'), "start_time");
    App.ColHead(model, thr.append('th'), "end_time");
    thr.append('th').append('button').attr('class','btn btn-link').attr('disabled','')
        .append('strong').html('duration (s)');
    App.ColHead(model, thr.append('th'), "status");
    App.ColHead(model, thr.append('th'), "message");

    var tb = tbl.append('tbody');
    model.each(function (x) {
        App.RefreshRowRender(tb, x.toJSON())
    });
};

// stuffs an element into each item.
// so we can twiddle its class, which is weird.
App.TopNavRenderer = function(el, items) {
    var d = d3.selectAll(el);
    var ni = d.append('div').attr('class','row-fluid')
        .append('div').attr('class','span12')
        .append('div').attr('class','navbar')
        .append('div').attr('class','navbar-inner');
    ni.append('div').attr('class','brand').attr('href','#').html('Enrich')
    var ul = ni.append('ul').attr('class','nav')
    _.each(_.keys(items), function(x){
        var item = items[x];
        item.el = ul.append('li')
        item.el.append('a').attr('href',item.url).html(item.name)
    });
};

App.FooterRenderer = function(el) {
    d3.selectAll(el)
        .append('div').attr('class','container-fluid')
        .append('div').attr('class','row-fluid')
        .append('div').attr('class','span12')
        .html('&copy; 2012 Enrich Consulting')
};

App.HomeRenderer = function(el) {
    var theel = d3.selectAll(el);
    var d = theel
        .append('div').attr('class','row-fluid')
        .append('div').attr('class','span12')
        .append('div').attr('class','hero-unit');
    d.append('h1').html('EPS View');
    d.append('p').html("This is a single-page javascript view of the EPS.");
    var e = theel
        .append('div').attr('class','row-fluid')
        .append('div').attr('class','span12');
    e.append('p').html('JSON services available here:');
    var l = e.append('ul')
    l.append('li').html('<a href="../RestStatus/help">RestStatus,</a> the data in the "metrics" tab here.');
    l.append('li').html('<a href="../RestService/help">RestService,</a> a pile of things i am playing with');
    l.append('li').html('<a href="../FactTableService/help">FactTableService</a>, fetches from engines');
    l.append('li').html('<a href="../TableService/help">TableService</a> serves portfolios, projects, refreshes, snapshots, snapshotvariables');
    l.append('li').html('<a href="../SnapVarFactTableService/help">SnapVarFactTableService,</a> fetches vars from snapshots without parsing with engine');
};

/**
 * An attempt to duplicate the admin view of the legacy app
 */
App.AdminRenderer = function(el) {
    var d = d3.selectAll(el);

    var row = d.append('div').attr('class','row-fluid')
    var span = row.append('div').attr('class','span12')
    span.append('div').attr('class','media')
        .append('img').attr('class','media-object pull-left').attr('src', App.logo)
    var mb = span.append('div').attr('class','media-body')
    mb.append('p').text('Enrich Portfolio System')
    mb.append('h4').text('Administration')
    span.append('hr')

    row = d.append('div').attr('class','row-fluid')
    row.append('div').attr('class','span3')
    row.append('div').attr('class','span6')
        .append('div').attr('class','well')
        .text('hi')
};


App.PortVizRenderer = function(el) {
    var d = d3.selectAll(el);

    //d.append('div').attr('class','row-fluid')
    //    .append('div').attr('class','span12')
    //    .append('div').attr('class','well')
    //    .append('h4').text('Portfolio Visualizer')
    var row = d.append('div').attr('class','row-fluid')
    var menu = row.append('div').attr('class','span3')
    App.PortVizMenu(menu)
    var viz = row.append('div').attr('class','span9')
    App.PortVizViz(viz)
};

App.PortVizMenuHead = function(g, parent_id, id, name) {
    var l = g.append('div').attr('class','accordion-heading')
        .append('label').attr('class','checkbox')
    l.append('input').attr('type','checkbox').attr('value','p4')
    l.append('a')
        .attr('class','accordion-toggle')
        .attr('data-toggle','collapse')
        .attr('data-parent','#'+parent_id)
        .attr('href','#'+id)
        .text(name)
};

// types of portfolio conf; they're all different
App.PortVizProspect = function(acc, parent_id) {
    var id = 'portvizprospect';
    var g = acc.append('div').attr('class','accordion-group')
    g.append('div').attr('class','accordion-heading')
    App.PortVizMenuHead(g, parent_id, id, 'Prospect-theorist utility function')
    var b = g.append('div').attr('class','accordion-body collapse').attr('id', id)
        .append('div').attr('class','accordion-inner')
    b.append('p').text('This is what behavioral economists think you should do:' +
              'Optimize over project combinations to find the highest' +
              'portfoio expected NPV, given a cost constraint' +
              'and some utility function parameters')
    var fs = b.append('form').append('fieldset')
    fs.append('legend').text('Configuration')
    fs.append('label').text('budget limit')
    fs.append('input').attr('type','text').attr('id','foo')
    fs.append('label').text('maximum loss limit')
    fs.append('input').attr('type','text').attr('id','foo')
    fs.append('label').text('loss aversion')
    fs.append('input').attr('type','text').attr('id','foo')
    fs.append('label').text('risk aversion')
    fs.append('input').attr('type','text').attr('id','foo')
};
App.PortVizNPV = function(acc, parent_id) {
    var id = 'portviznpv'
    var g = acc.append('div').attr('class','accordion-group')
    g.append('div').attr('class','accordion-heading')
    App.PortVizMenuHead(g, parent_id, id, 'Risk-neutral maximum NPV')
    var b = g.append('div').attr('class','accordion-body collapse').attr('id', id)
        .append('div').attr('class','accordion-inner')
    b.append('p').text('This is what Ron Howard rationalists say you should do:' +
              'Optimize over project combinations to find the highest' +
              'portfoio expected risk-neutral NPV, given only a cost constraint')
    var fs = b.append('form').append('fieldset')
    fs.append('legend').text('Configuration')
    fs.append('label').text('budget limit')
    fs.append('input').attr('type','text').attr('id','foo')
};
App.PortVizRnR = function(acc, parent_id) {
    var id = 'portvizrnr'
    var g = acc.append('div').attr('class','accordion-group')
    g.append('div').attr('class','accordion-heading')
    App.PortVizMenuHead(g, parent_id, id, 'Choose projects in NPV order')
    var b = g.append('div').attr('class','accordion-body collapse').attr('id', id)
        .append('div').attr('class','accordion-inner')
    b.append('p').text('This is the "rank and yank" portfolio, an algorithm that ranks projects' +
              'by NPV, and fills the portfolio until you run out of budget.')
    var fs = b.append('form').append('fieldset')
    fs.append('legend').text('Configuration')
    fs.append('label').text('budget limit')
    fs.append('input').attr('type','text').attr('id','foo')
};
App.PortVizManual = function(acc, parent_id) {
    var id = 'portvizmanual'
    var g = acc.append('div').attr('class','accordion-group')
    App.PortVizMenuHead(g, parent_id, id, 'Choose projects manually')
    var b = g.append('div').attr('class','accordion-body collapse').attr('id', id)
        .append('div').attr('class','accordion-inner')
    b.append('p').text('Manual portfolio config, e.g. a list of checkboxes')
    var fs = b.append('form').append('fieldset')
    fs.append('legend').text('Configuration')
    for (i = 0; i < 20; ++i) {
    var l = fs.append('label').attr('class','checkbox')
    l.text('Project ' + i)
    l.append('input').attr('type','checkbox').attr('value','')
    }
};

App.PortVizMenu = function(sel) {
    var id = 'portvizmenu'
    sel.append('h4').text('Portfolios')
    var acc = sel.append('div').attr('class','accordion').attr('id',id)
    App.PortVizProspect(acc, id);
    App.PortVizNPV(acc, id);
    App.PortVizRnR(acc, id);
    App.PortVizManual(acc, id);
    sel.append('a').attr('href','#').attr('class','btn pull-right').text('Make a new portfolio')
};
App.PortVizViz = function(sel) {
    sel.append('h4').text('Visualizations')
    var ul = sel.append('ul').attr('class','nav nav-tabs').attr('data-tabs','tabs')
    var c = sel.append('div').attr('class','tab-content')

    var l1 = ul.append('li')
    l1.append('a').attr('href','#v1').attr('data-toggle','tab').text('Bubbles') 
    var v1 = c.append('div').attr('class','tab-pane').attr('id','v1')
    v1.append('p').text('This chart shows a bubble per project, with multiple portfolios superimposed.')
    v1.append('p').text('Use the checkboxes on the far left to turn portfolios on and off in this view')
    v1.append('p').text('Shows five dimensions: x, y, bubble size, bubble shade, bubble hue (per port)')

    var l2 = ul.append('li')
    l2.append('a').attr('href','#v2').attr('data-toggle','tab').text('Revenue/time') 
    var v2 = c.append('div').attr('class','tab-pane').attr('id','v2')
    v2.append('p').text('A simple graph of expected revenue over time.  Multiple portfolios are superimposed.')

    var l3 = ul.append('li')
    l3.append('a').attr('href','#v3').attr('data-toggle','tab').text('Project table') 
    var v3 = c.append('div').attr('class','tab-pane').attr('id','v3')
    v3.append('p').text(' A simple table showing project membership in a portfolio, as well as some other stuff about each project (e.g. its cost).')

    l1.classed('active',true)
    v1.classed('active',true)


    
};

// you could imagine this being a presentation tool or something
App.ContentRenderer = function(el) {
    var d = d3.selectAll(el);
    d.append('div').attr('class','row-fluid')
        .append('div').attr('class','span12')
        .append('div').attr('class','well').html('This is content')
    var cr = d.append('div').attr('class','row-fluid')
    var c = cr.append('div').attr('id','myCar').attr('class','carousel slide').attr('data-interval','0')
    var i = c.append('div').attr('class','carousel-inner')
    var i1 = i.append('div').attr('class','well item active')
    i1.append('h2').html('The best way to predict the future is to invent it.')
    App.simpleplot(i1)
    var i1c = i1.append('div').attr('class','carousel-caption')
    i1c.append('h4').html('label1')
    i1c.append('p').html('some sort of caption here explaining why this is interesting.  blah blah blah.')
    var i2 = i.append('div').attr('class','well item')
    i2.append('h2').html('Always bring a knife to a gunfight.  And a gun.')
    App.simpleplot(i2)
    var i2c = i2.append('div').attr('class','carousel-caption')
    i2c.append('h4').html('label2')
    i2c.append('p').html('some sort of caption here explaining why this is interesting.  blah blah blah.')
    var i3 = i.append('div').attr('class','well item')
    i3.append('h2').html('Everything should be made as simple as possible, but not simpler.')
    App.simpleplot(i3)
    var i3c = i3.append('div').attr('class','carousel-caption')
    i3c.append('h4').html('label3')
    i3c.append('p').html('some sort of caption here explaining why this is interesting.  blah blah blah.')
    c.append('a').attr('class','carousel-control left').attr('href','#myCar').attr('data-slide','prev')
        .html('&lsaquo;')
    c.append('a').attr('class','carousel-control right').attr('href','#myCar').attr('data-slide','next')
        .html('&rsaquo;')
};

// #userlist is the hook for the subview.
App.UsersRenderer = function(el) {
    var d = d3.selectAll(el);
    d.append('div').attr('class','row-fluid')
        .append('div').attr('class','span12').html('This is the users page')
    d.append('div').attr('id','userlist');
};

// #listfilter is the hook for the filter subview.
// #projectlist is the hook for the list subview.
App.ProjectsRenderer = function(el) {
    var d = d3.selectAll(el);
    d.append('div').attr('class','row-fluid')
        .append('div').attr('class','span12')
        .append('div').attr('class','pull-right')
        .append('a').attr('href', App.ProjCreateUrl)
        .append('b').html('Create Project');
    d.append('div').attr('id','filterhook');
    d.append('div').attr('id','listhook');
};

App.PortfoliosRenderer = function(el) {
    var d = d3.selectAll(el);
    d.append('div').attr('class','row-fluid')
        .append('div').attr('class','span12').html('This is the portfolios page')
    d.append('div').attr('id','filterhook');
    d.append('div').attr('id','listhook');
};

App.SnapshotsRenderer = function(el) {
    var d = d3.selectAll(el);
    d.append('div').attr('class','row-fluid')
        .append('div').attr('class','span12').html('This is the snapshots page')
    d.append('div').attr('id','snaplist');
};

App.VariablesRenderer = function(el) {
    var d = d3.selectAll(el);
    d.append('div').attr('class','row-fluid')
        .append('div').attr('class','span12').html('This is the snapshot variables page.');
    d.append('div').attr('id','variablelist');
};

App.RefreshRenderer = function(el) {
    d3.selectAll(el).append('div').attr('id','refreshes-inner')
};

/**
 * @param {backbone collection} list please make sure it's full.
 */
App.FilterRenderer = function(el, list) {
    console.log('filter');
    var sel = d3.selectAll(el);
    // the filter well
    var flt = sel.append('div').attr('class','row-fluid')
        .append('div').attr('class','span12')
        .append('div').attr('class','well well-small')

    // the filter expand button
    var fltb = flt.append('button').attr('type','button').attr('class','btn btn-link')
        .attr('data-toggle','collapse').attr('data-target','#filter')
        .html('filters')
    var fltdiv = flt.append('div').attr('id','filter').attr('class','collapse')
    var fltform = fltdiv.append('form')
        .attr('class','form-horizontal')

    App.filterName(fltform);

    var attrFields = fltform.append('div').attr('id','attrFields')

    var okattrs = list.filter(function(x){return x.get('filter');});
    var sortedokattrs = _.sortBy(okattrs, function(x){return x.get('rank');})
    _.each(sortedokattrs, function(attr) {
        // console.log(attr.get('id') + ' ' + attr.get('name') + ' ' + attr.get('type'));
        App.filter(attrFields, attr)
    });

    // submit buttons
    var c3 = fltform.append('div').attr('class','control-group')
    var cc3 = c3.append('div').attr('class','controls')
    var cc3b = cc3.append('div').attr('class','btn-group')
    cc3b.append('button').attr('type','button').attr('class','btn btn-primary').attr('id','filterit')
        .html('submit')
    cc3b.append('button').attr('type','button').attr('class','btn').attr('id','clearit')
        .html('clear')
};

// BAH. the "proj list" and "proj mgmt" views have different columns,
// TODO: clean this shit up
App.mgmtfilter = function(attr) { return attr.get('mgmt_view') }
App.mgmtsort   = function(attr) { return App.mgmtfilter(attr) + ' ' + attr.get('id');}
App.listfilter = function(attr) { return attr.get('list_view') }
App.listsort   = function(attr) { return App.listfilter(attr) + ' ' + attr.get('id');}

App.ProjectListRenderer = function(el, model, metaModel) {
    var sel = d3.selectAll(el);
    App.pagination(sel, model);
    var tbl = App.tbl(sel)
    var thr = tbl.append('thead').append('tr');
    //App.ColHead(model, thr.append('th'), "project_id");
    App.ColHead(model, thr.append('th'), "Project Name");
    //App.ColHead(model, thr.append('th'), "Creator");
    //App.ColHead(model, thr.append('th'), "Create Time");
    //thr.append('th').append('button').attr('class','btn btn-link')
    //    .attr('disabled','true')
    //    .append('strong')
    //    .html("Snapshots");

    _.each(
        _.sortBy(
            metaModel.filter(
                function(x){return App.listfilter(x) > 0;}),
            function(x){return App.listsort(x);}),
        function(x){App.ColHead(model, thr.append('th'), x.get('name'));});

    App.ColHead(model, thr.append('th'), "Last Publication");

    var tb = tbl.append('tbody');
    model.each(function (x) {
        App.ProjRowRender(tb, x, metaModel)
    });

    $('[rel=tooltip]', el).tooltip();
};

App.ProjectMgmtRenderer = function(el, model, metaModel) {
    var sel = d3.selectAll(el);
    App.pagination(sel, model);
    var tbl = App.tbl(sel)
    var thr = tbl.append('thead').append('tr');
    //App.ColHead(model, thr.append('th'), "project_id");
    App.ColHead(model, thr.append('th'), "Project Name");
    App.ColHead(model, thr.append('th'), "Creator");
    //App.ColHead(model, thr.append('th'), "Create Time");
    //thr.append('th').append('button').attr('class','btn btn-link')
    //    .attr('disabled','true')
    //    .append('strong')
    //    .html("Snapshots");

    _.each(
        _.sortBy(
            metaModel.filter(
                function(x){return App.mgmtfilter(x) > 0;}),
            function(x){return App.mgmtsort(x);}),
        function(x){App.ColHead(model, thr.append('th'), x.get('name'));});

    //App.ColHead(model, thr.append('th'), "Last Publication");
    App.ColHead(model, thr.append('th'), "Status");
    App.ColHead(model, thr.append('th'), "Copy");
    App.ColHead(model, thr.append('th'), "Remove");
    

    var tb = tbl.append('tbody');
    model.each(function (x) {
        App.ProjMgmtRowRender(tb, x, metaModel)
    });

    $('[rel=tooltip]', el).tooltip();
};

App.PortfolioListRenderer = function(el, model, metaModel) {
    var sel = d3.selectAll(el);
    App.pagination(sel, model);
    var tbl = App.tbl(sel);
    var thr = tbl.append('thead').append('tr');
    App.ColHead(model, thr.append('th'), "portfolio_id");
    App.ColHead(model, thr.append('th'), "name");
    App.ColHead(model, thr.append('th'), "creator_id");
    App.ColHead(model, thr.append('th'), "create_time");
    App.ColHead(model, thr.append('th'), "populated");
    thr.append('th').html('snapshots')
    
    _.each(
        _.sortBy(
            metaModel.filter(
                function(x){return x.get('list_view') > 0;}),
            function(attr){return attr.get('list_view');}),
        function(x) {App.ColHead(model, thr.append('th'), x.get('name')); });

    var tb = tbl.append('tbody');
    model.each(function (x) {
        App.PortRowRender(tb, x, metaModel)
    });
    $('[rel=tooltip]', el).tooltip();
};

App.SnapListRenderer = function(el, model) {
    var sel = d3.selectAll(el);
    App.pagination(sel, model);
    var tbl = App.tbl(sel);
    var thr = tbl.append('thead').append('tr');
    App.ColHead(model, thr.append('th'), "snapshot_id");
    App.ColHead(model, thr.append('th'), "snapshot_name");
    App.ColHead(model, thr.append('th'), "creator_id");
    App.ColHead(model, thr.append('th'), "project_id");
    App.ColHead(model, thr.append('th'), "approved");
    App.ColHead(model, thr.append('th'), "creation_time");
    App.ColHead(model, thr.append('th'), "refresh_time");
    App.ColHead(model, thr.append('th'), "populated");
    var failbutton = thr.append('th').append('div').attr('class','btn-group')
    failbutton.append('a').attr('class','btn btn-link dropdown-toggle')
        .attr('data-toggle','dropdown').attr('href','javascript:void(0)')
        .text('failed')
    var fu = failbutton.append('ul').attr('class','dropdown-menu')
    fu.append('a').attr('href','javascript:void(0)').text('failed only')
    fu.append('a').attr('href','javascript:void(0)').text('success only')
    fu.append('a').attr('href','javascript:void(0)').text('show all')
    thr.append('th').text('refreshes')

    var tb = tbl.append('tbody');
    model.each(function (x) {
        App.SnapRowRender(tb, x)
    });

    $('[rel=tooltip]', el).tooltip();

};

App.UserListRenderer = function(el, model) {
    var sel = d3.selectAll(el);
    App.pagination(sel, model);
    var tbl = App.tbl(sel);

    var thr = tbl.append('thead').append('tr');
    App.ColHead(model, thr.append('th'), "user_id");
    App.ColHead(model, thr.append('th'), "name");

    var tb = tbl.append('tbody');
    model.each(function (x) {
        App.UserRowRender(tb, x.toJSON())
    });

    $('[rel=tooltip]', el).tooltip();
};

App.VariableListRenderer = function(el, model) {
    var sel = d3.selectAll(el);
    App.pagination(sel, model);
    var tbl = App.tbl(sel);

    var thr = tbl.append('thead').append('tr');
    App.ColHead(model, thr.append('th'), "snapshot_id");
    App.ColHead(model, thr.append('th'), "variable_name");
    App.ColHead(model, thr.append('th'), "variable_type");
    App.ColHead(model, thr.append('th'), "uri");

    var tb = tbl.append('tbody');
    model.each(function (x) {
        App.VarRowRender(tb, x.toJSON())
    });

    $('[rel=tooltip]', el).tooltip();
};

App.MetricsRenderer = function(el) {
    var d = d3.selectAll(el);
    d.append('div').attr('class','row-fluid')
        .append('div').attr('class','span12')
        .append('div').attr('class','page-header')
        .append('h1').text('server metrics')
    d.append('div').attr('id','status_status_inner')
    d.append('img').attr('class','img-rounded').attr('src','../images/jvv.jpg')
};

App.MetricsListRenderer = function(el, model) {
    var d = d3.selectAll(el)
        .append('div').attr('class','row-fluid')
        .append('div').attr('class','span12')
        .append('dl')
        .selectAll('div')
        .data(model.models)
        .enter().append('div')
    d.append('dt').text(function(d){ return d.get('key')});
    d.append('dd').append('pre').text(function(d){return d.get('value')})
};

App.MainRenderer = function(el) {
    var d = d3.selectAll(el)
    var w = d.append('div').attr('id','wrap')
    var c = w.append('div').attr('class','container-fluid')
    c.append('div').attr('id','topnav')
    c.append('div').attr('id','content')
    w.append('div').attr('id','push')
    d.append('div').attr('id','footer')
};
