// view types

/**
 * sources 'filterme' to indicate a new filter submit.
 */
App.FilterView = Backbone.View.extend({
    // this is the set of all "attributes"; the caller needs to supply it
    /** @type {async-collection} */
    metaModel: undefined,
    /** @type {backbone model } */
    model: undefined,
    // instantiated below
    modelBinder: undefined,
    filter: undefined,
    /**
     * options i expect:
     * filter: the string from the url, for the initial filter setting
     * metamodel: projattr, fetched by the container at render time
     */
    initialize: function() {
        console.log('filterview init');

        this.filter = this.options.filter;
        this.model = new App.FilterModel();
        this.metaModel = this.options.metaModel;
        this.metaModel.bind('reset', this.render, this);
        console.log('meta ' + JSON.stringify(this.metaModel.toJSON()))
        console.log('model ' + JSON.stringify(this.model.toJSON()))
        this.modelBinder = new Backbone.ModelBinder();
        console.log('done filterview init');
        // always fetch again; it might have changed.
        // this.metaModel.list.pager();
        // render once
        // this.render();
        // in the future, render on resets
        // TODO: remove this
        // var self = this
        // this.model.bind('change', function() {
        //    // just so we can see the change events.
        //    alert('change event\n' + JSON.stringify(self.model.toJSON()));
        // });
    },
    filterit: function() {
        var navstr = App.navstr(this.model);
        App.vent.trigger('filterme', navstr);
    },
    clearit: function() {
        this.model.clear();
        var navstr = App.navstr(this.model);
        App.vent.trigger('filterme', navstr);
    },
    events: {
        'click button#filterit':'filterit',
        'click button#clearit':'clearit'
    },
    render: function() {
        console.log("filterview render");
        this.$el.empty();
        // the event binding to the metamodel list means that it's ready.
        App.FilterRenderer(this.$el, this.metaModel);
        //console.log(JSON.stringify(this.metaModel.toJSON()))
        this.model = App.inverseNavstr(this.filter, this.metaModel);
        console.log('model: ' + JSON.stringify(this.model.toJSON()))
        this.modelBinder.bind(this.model, this.el);
        return this;
    },
    remove: function() {
        this.modelBinder.unbind();
        this.$el.empty();
    }
});


/** 
 * take an object and turn it into eq(x,y)...
 *
 * TODO: use "re" for regex (trivially, substring), not exact match, for text fields.
 * for now, the server magically does the right thing.
 *
 * @param {backbone model} filterModel 
 */
App.navstr = function(filterModel) {
    var obj = filterModel.toJSON();
    if (_.isEmpty(obj)) return '';
    var clauses = _.map(_.keys(obj), function(key){
        var val = obj[key]
        // empty constraint is like no constraint
        if (val == '')  { return ''; }
        if (key.indexOf(",") !== -1) throw "no commas allowed in key: " + key;
        if (val.indexOf(",") !== -1) throw "no commas allowed in val: " + val;
        return 'eq(' + key + ',' + val + ')';
    });
    var res = _.compact(clauses).join('.');
    return res;
};

/**
 * take eq(x,y) and turn it into the model to bind to the filter
 * 
 * this is browser string, could be crap.
 * TODO: deal with it
 */
App.inverseNavstr = function(filter, metaModel) {
    console.log('inversenavstr');
    //console.log(JSON.stringify(metaModel.toJSON()))

    var result = new App.FilterModel();
    // this isn't done, so...
    // return result;
    // this would be exactly the same as the one in the server.
    // if they implemented regexes the same.  yay.
    // var re = new RegExp("^(?:eq\(([^,]+),\s*([^\)]+)\)\.*)+$");
    // var re = XRegExp('^(eq\\((?<key>[^,]+),\\s*(?<value>[^\\)]+)\\)\\.*)+$', 'n');
    // var re = XRegExp('^(?<clause>eq\\(([^,]+),\\s*([^\\)]+)\\)\\.*)+$', 'n');
    // var clauses = XRegExp('(eq\\([^,]+,\\s*[^\\)]+\\))\\.*','g');
    // var terms = XRegExp('eq\\((?<key>[^,]+),\\s*(?<value>[^\\)]+)\\)\\.*');

    var re = XRegExp('eq\\((?<key>[^,]+),\\s*(?<value>[^\\)]+)\\)\\.*', 'gn');
    var keys = []
    var vals = []
    XRegExp.forEach(filter, re, function(x) {
        console.log('match key ' + x.key);
        console.log('match val ' + x.value);
        keys.push(x.key);
        vals.push(x.value);
    });

    // whitelist the values.
    // actually why do i care about this?
    // the browser will do it, no?
    for (i = 0; i < vals.length; i++) {
        var key = keys[i];
        var val = vals[i];
        if (metaModel.some(function(attr) {
            //console.log(attr.get('name'));
            return attr.get('id') == key &&
                //attr.get('value') == val &&
                attr.get('filter')
        })) {
            console.log('got it ' + key);
            result.set(key, val);
        };
    };
    return result;
};

App.TopNavView = Backbone.View.extend({
    items: {
        'home':       { name: 'Home',       url: '#',           el: null},
        'content':    { name: 'Content',    url: '#content',    el: null},
        'projects':   { name: 'Projects',   url: '#projects',   el: null},
        'portfolios': { name: 'Portfolios', url: '#portfolios', el: null},
        'portviz':    { name: 'PortViz',    url: '#portviz',    el: null},
        'snapshots':  { name: 'Snapshots',  url: '#snapshots',  el: null},
        'variables':  { name: 'Variables',  url: '#variables',  el: null},
        'users':      { name: 'Users',      url: '#users',      el: null},
        'refreshes':  { name: 'Refreshes',  url: '#refreshes',  el: null},
        'metrics':    { name: 'Metrics',    url: '#metrics',    el: null},
        'admin':      { name: 'Admin',      url: '#admin',      el: null},
        'projmgmt':   { name: 'Proj Mgmt',  url: '#projmgmt',   el: null},
    },
    // set the 'active' class for the selected item
    setSelected: function(newkey){
        if(this.selected) {this.items[this.selected].el.attr('class','')}
        this.selected = newkey;
        this.items[this.selected].el.attr('class','active') 
    },
    selected: '',
    render: function (eventName) {
        this.$el.empty();
        App.TopNavRenderer(this.$el, this.items);
        return this;
    },
    remove: function() {
        this.$el.empty();
    }
});

App.FooterView = Backbone.View.extend({
    render: function (eventName) {
        this.$el.empty();
        App.FooterRenderer(this.$el);
        return this;
    },
    remove: function() {
        this.$el.empty();
    }
});

App.HomeView = Backbone.View.extend({
    render: function (eventName) {
        this.$el.empty();
        App.HomeRenderer(this.$el);
        return this;
    },
    remove: function() {
        this.$el.empty();
    }
});


App.AdminView = Backbone.View.extend({
    render: function (eventName) {
        this.$el.empty();
        App.AdminRenderer(this.$el);
        return this;
    },
    remove: function() {
        this.$el.empty();
    }
});

App.PortVizView = Backbone.View.extend({
    render: function (eventName) {
        this.$el.empty();
        App.PortVizRenderer(this.$el);
        return this;
    },
    remove: function() {
        this.$el.empty();
    }
});

App.ContentView = Backbone.View.extend({
    render: function (eventName) {
        this.$el.empty();
        App.ContentRenderer(this.$el);
        return this;
    },
    remove: function() {
        this.$el.empty();
    }
});

App.UsersView = Backbone.View.extend({
    render: function (eventName) {
        this.$el.empty();
        App.UsersRenderer(this.$el);
        this.userlistview = this.options.userlist( $('#userlist', this.$el) );
        return this;
    },
    remove: function() {
        this.userlistview.remove();
        this.$el.empty();
    },
});

App.ProjectsView = Backbone.View.extend({
    render: function (eventName) {
        console.log("projectsview render");
        this.options.metaModel.reset();
        this.$el.empty();
        App.ProjectsRenderer(this.$el);
        this.filterview = this.options.filterview( $('#filterhook', this.$el) );
        this.listview = this.options.listview( $('#listhook', this.$el) );
        console.log('metamodel pager');
        this.options.metaModel.pager();
        return this;
    },
    remove: function() {
        this.filterview.remove();
        this.listview.remove();
        this.$el.empty();
    },
});

App.PortfoliosView = Backbone.View.extend({
    render: function (eventName) {
        this.options.metaModel.reset();
        this.$el.empty();
        App.PortfoliosRenderer(this.$el);
        this.filterview = this.options.filterview( $('#filterhook', this.$el) );
        this.listview = this.options.listview( $('#listhook', this.$el) );
        this.options.metaModel.pager();
        return this;
    },
    remove: function() {
        this.filterview.remove();
        this.listview.remove();
        this.$el.empty();
    },
});

App.SnapshotsView = Backbone.View.extend({
    render: function (eventName) {
        this.$el.empty();
        App.SnapshotsRenderer(this.$el);
        this.snaplistview = this.options.snaplist( $('#snaplist', this.$el) );
        return this;
    },
    remove: function() {
        this.snaplistview.remove();
        this.$el.empty();
    },
});

App.VariablesView = Backbone.View.extend({
    render: function (eventName) {
        this.$el.empty();
        App.VariablesRenderer(this.$el);
        this.content = this.options.snaplist( $('#variablelist', this.$el) );
        return this;
    },
    remove: function() {
        this.content.remove();
        this.$el.empty();
    },
});

App.RefreshView = Backbone.View.extend({
    /** @private */ contentview: undefined,
    render: function (eventName) {
        this.$el.empty();
        App.RefreshRenderer(this.$el);
        this.contentview = this.options.content( $('#refreshes-inner', this.$el) );
        return this;
    },
    remove: function() {
        if (this.contentview) this.contentview.remove();
        this.$el.empty();
    },
});


App.BaseListView = Backbone.View.extend({
    events: {
        'click button.next': 'nextResultPage',
        'click button.prev': 'prevResultPage',
        'click button.sort': 'updateOrder',
        'click a.delete': 'deleteItem',
    },
    nextResultPage: function (e) {
        this.model.requestNextPage();
    },
    prevResultPage: function (e) {
        this.model.requestPreviousPage();
    },
    updateOrder: function(e) {
        if (this.model.sortDir == 'asc') {
            this.model.sortDir = 'desc'
        } else {
            this.model.sortDir = 'asc'
        }
        this.model.updateOrder($(e.currentTarget).attr("value"));
    },
    deleteItem: function(e) {
        console.log("override me")
    },
});



App.BaseProjectListView = App.BaseListView.extend({
    /** @private */ metaModel: undefined,
    /** @private */ model: undefined,
    /**
     * options expected:
     * el
     * filter
     * metaModel -- fetched by the container view at render time
     * model
     */
    initialize: function () {
        // do event inheritance and overriding
        this.events = _.extend({}, App.BaseListView.prototype.events, this.events)
        this.model.bind("reset", this.render, this);
        this.metaModel = this.options.metaModel;
        this.metaModel.bind("reset", this.render, this);
        if (this.options.filter) {
            this.model.filter = this.options.filter;
        } else {
            this.model.filter = "";
        }
        this.model.pager();
        //this.metaModel.list.pager();
        // subscribe to the filter view's events
        App.vent.on('filterme', this.filterit, this);
    },
    /** @param {backbone model} arg */
    filterit: function(navstr) {
        //console.log('filterit')
        var url = 'projects';
        if (navstr != '') { 
            url += '/' + navstr
        }
        App.app.navigate(url, false);
        this.model.filter = navstr
        // this causes a render
        this.model.pager();
        // change the filter params
        // this.render();
        //console.log('filterit done')
    },
    /*
    we want to render when the model resets,
    and when the metamodel resets.
    we'd like *not* to render if one of these
    collections isn't 'ready' when the other resets.
    */
    render: function (eventName) {
        if (! this.metaModel.fetched()) {
            console.log('no metamodel');
            return;
        };
        if (! this.model.fetched()) {
            console.log('no model, skipping project list rendering');
            return;
        };
        console.log('got both models, projectlistview render');
        this.$el.empty();
        this.painter(this.$el, this.model, this.metaModel);
        return this;
    },
    remove: function() {
        this.$el.empty();
        this.model.unbind();
        this.metaModel.unbind();
        App.vent.off('filterme', this.filterit);
    },
});

App.ProjMgmtListView = App.BaseProjectListView.extend({
    painter: function(e,m,mm) { 
        App.ProjectMgmtRenderer(e, m, mm) 
        } 
});
App.ProjectListView = App.BaseProjectListView.extend({
    painter: function(e,m,mm) { 
        App.ProjectListRenderer(e, m, mm) 
        } 
});

App.PortfolioListView = App.BaseListView.extend({
    initialize: function () {
        this.model.bind("reset", this.render, this);
        this.model.bind("error", this.error, this);
        this.metaModel = this.options.metaModel;
        this.metaModel.bind("reset", this.render, this);
        this.model.pager();
    },
    error: function() {
        console.log("error!");
    },
    render: function (eventName) {
        if (! this.metaModel.fetched()) {
            console.log('no metamodel');
            return;
        };
        if (! this.model.fetched()) {
            console.log('no model, skipping port list rendering');
            return;
        };
        this.$el.empty();
        App.PortfolioListRenderer(this.$el, this.model, this.metaModel);
        return this;
    },
    remove: function() {
        this.$el.empty();
        this.model.unbind();
    }
});

App.SnapListView = App.BaseListView.extend({ 
    initialize: function () {
        this.model.bind("reset", this.render, this);
        this.model.pager();
    },
    render: function (eventName) {
        this.$el.empty();
        App.SnapListRenderer(this.$el, this.model);
        return this;
    },
    remove: function() {
        this.$el.empty();
        this.model.unbind();
    },
    deleteItem: function(e) {
        console.log("delete!")
        console.log(e)
        console.log($(e.currentTarget).attr("id"));
    },
});

App.UserListView = App.BaseListView.extend({ 
    initialize: function () {
        this.model.bind("reset", this.render, this);
        // since 'main' has already called the userlist pager, we don't need to
        // but we should fire the reset event.
        var self = this
        App.users.defer(function(x) {
            return function() { 
                self.model.trigger('reset');
            }
        });
        // this.model.pager();
    },
    render: function (eventName) {
        this.$el.empty();
        App.UserListRenderer(this.$el, this.model);
        return this;
    },
    remove: function() {
        this.$el.empty();
        this.model.unbind();
    },
    deleteItem: function(e) {
        console.log("delete!")
        console.log(e)
        console.log($(e.currentTarget).attr("id"));
    },
});

App.VariableListView = App.BaseListView.extend({ 
    initialize: function () {
        this.model.bind("reset", this.render, this);
        this.model.pager();
    },
    render: function (eventName) {
        this.$el.empty();
        App.VariableListRenderer(this.$el, this.model);
        return this;
    },
    remove: function() {
        this.$el.empty();
        this.model.unbind();
    },
    deleteItem: function(e) {
        console.log("delete!")
        console.log(e)
        console.log($(e.currentTarget).attr("id"));
    },
});



App.RefreshListView = App.BaseListView.extend({ 
    initialize: function () {
        this.model.bind("reset", this.render, this);
        this.model.pager();
    },
    render: function (eventName) {
        this.$el.empty();
        App.RefreshListRender(this.$el, this.model);

        // TODO: inject this, like the others?
        this.plotview = new App.TimeSeriesPlotView({
            el: $('.table_plot', this.$el),
            model: this.model
        });
        $('[rel=tooltip]', this.$el).tooltip();

        return this;
    },
    remove: function() {
        this.$el.empty();
        this.model.unbind();
    },
    deleteItem: function(e) {
        console.log("delete the snap for this refresh item!")
        console.log(e)
        console.log($(e.currentTarget).attr("id"));
    },
});

App.MetricsView = Backbone.View.extend({
    /** @private */ contentview: undefined,
    render: function (eventName) {
        this.$el.empty();
        App.MetricsRenderer(this.$el);
        this.contentview = this.options.content( $('#status_status_inner', this.$el) );
        return this;
    },
    remove: function() {
        if (this.contentview) this.contentview.remove();
        this.$el.empty();
    },
});

App.MetricsListView = Backbone.View.extend({
    initialize: function() {
        this.model.bind("reset", this.render, this);
        this.model.fetch();
    },
    render: function (eventName) {
        this.$el.empty();
        App.MetricsListRenderer(this.$el, this.model);
        return this;
    },
    remove: function() {
        this.$el.empty();
        this.model.unbind();
    }
});

App.MainView = Backbone.View.extend({
    /** @private */ topnavview: undefined,
    /** @private */ contentview: undefined,
    /** @private */ footerview: undefined,
    /** @private */
    currentviewname: undefined,
    render: function (eventName) {
        this.$el.empty();
        App.MainRenderer(this.$el);
        this.topnavview = this.options.topnav( $('#topnav', this.$el) );
        this.topnavview.render();
        this.footerview = this.options.footer( $('#footer', this.$el) );
        this.footerview.render();
        return this;
    },
    /**
     * remove old view if it exists; make the new one and render it.
     * if there's no content view, make one and render it.
     * TODO: if new is same as old, just update it somehow?
     * otherwise, if you freehand the URL, you won't get what you think.
     * well, you will, it will just flash.
     */
    setContent: function(name, viewfactory) {
        console.log('setcontent ' + name);
        this.topnavview.setSelected(name);
        if (this.contentview) this.contentview.remove()
        this.contentview = viewfactory( $('#content', this.$el) )
        this.contentview.render();
    },
    remove: function() {
        this.$el.empty();
        if (this.contentview) this.topnavview.remove();
        if (this.contentview) this.footerview.remove();
        if (this.contentview) this.contentview.remove();
        this.model.unbind();
    }
});
