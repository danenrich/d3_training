// collection types

App.Paginated = function(args) {
    return Backbone.Paginator.requestPager.extend({
        /** @public */ totalPages: undefined,
        /** @public */ startRow: undefined,
        /** @public */ endRow: undefined,
        /** @public */ totalRows: undefined,
        /** @public */ model: args.model,
        /** @private */ _fetched: false,
        fetched: function() {
            return this._fetched;
        },
        paginator_core: {
            type: 'GET',
            dataType: 'json',
            url: args.url,
        },
        paginator_ui: {
            firstPage: 0,
            currentPage: 0,
            perPage: 200,
            totalPages: 0,
            sortField: args.defaultsort,
            sortDir: args.defaultdir,
            filter: ""
        },
        server_api: {
            'limit': function() { return this.perPage },
            'skip': function() { 
                if (this.currentPage < 0) return 0;
                return this.currentPage * this.perPage;
            },
            'order': function() { 
                if (this.sortDir == "asc") return this.sortField 
                if (this.sortField == "") return ""
                // desc
                return "-" + this.sortField 
            },
            'filter': function() { return this.filter }
        },
        parse: function(response) {
            //console.log(response)
            this.totalPages = Math.ceil(response.totalRows / this.perPage);
            this.startRow = response.startRow;
            this.endRow = response.endRow;
            this.totalRows = response.totalRows;
            return response.data;
        },
        sync: function(method, model, options) {
            //console.log(options)
            //console.log('foo')
            this._fetched = true;
            return Backbone.Paginator.requestPager.prototype.sync.call(this, method, model, options);
        }
    });
};

//
// PORTFOLIOS
//
App.Portfolios = App.Paginated({
    model: App.PortfolioModel,
    url: App.baseurl + "portfolios/",
    defaultsort: 'portfolio_id',
    defaultdir: 'asc'
});

//
// PROJECTS
//
App.Projects = App.Paginated({
    model: App.ProjectModel,
    url: App.baseurl + "projects/",
    defaultsort: 'project_id',
    defaultdir: 'asc'
});

//
// REFRESHES
//
App.Refreshes = App.Paginated({
    model: App.RefreshModel,
    url: App.baseurl + "refreshes/",
    defaultsort: 'start_time',
    defaultdir: 'desc'
});

//
// SNAPS
//
App.Snaps = App.Paginated({
    model: App.SnapModel,
    url: App.baseurl + "snaps/",
    defaultsort: 'snapshot_id',
    defaultdir: 'asc'
});

//
// SNAPVARS
//
App.Variables = App.Paginated({
    model: App.VariableModel,
    url: App.baseurl + "snapvars/",
    defaultsort: 'foo',
    defaultdir: 'desc'
});

//
// the attr and user collections are mostly used to join to other things;
// maybe i should use https://github.com/PaulUithol/Backbone-relational

//
// PROJATTR -- metadata, not proj attrs
//
App.Attrs = App.Paginated({
    model: App.AttrModel,
    url: App.baseurl + "projattrs/",
    defaultsort: 'rank',
    defaultdir: 'asc'
});

//
// PORTATTR
//
App.PortAttrs = App.Paginated({
    model: App.AttrModel,
    url: App.baseurl + "portattrs/",
    defaultsort: 'rank',
    defaultdir: 'asc'
});

//
// USERS
//
App.Users = App.Paginated({
    model: App.UserModel,
    url: App.baseurl + "users/",
    defaultsort: 'user_id',
    defaultdir: 'asc'
});


//
// STATUS (uses a different service url)
//
// TODO: fix up this url
//
App.Metrics = Backbone.Collection.extend({
    model: App.StatusModel,
    url: "../RestStatus/models/"
});
