// GLOBALS

// global event aggregator; use this to pass events from
// one view to another.
App.vent = _.extend({}, Backbone.Events);

// singleton collections
App.projsList = new App.Projects();
App.portsList = new App.Portfolios();
App.snapsList = new App.Snaps();
App.variablesList = new App.Variables();

// this should not actually be the paginated one.
App.usersList = new App.Users();
App.refreshList = new App.Refreshes();
App.metricsList = new App.Metrics();

App.main = new App.MainView({
    el: $('body'),
    footer: function(el) { return new App.FooterView({el: el}); },
    topnav: function(el) { return new App.TopNavView({el: el}); }
});

App.main.render();

App.AppRouter = Backbone.Router.extend({
    routes: {
        "":                               "home",
        "admin":                          "admin",
        "content":                        "content",
        "projects":                       "projects",
        "projects/":                      "projects",
        "projects/:filter":               "projects",
        "projects/:project_id":           "project",
        "projects/:project_id/snapshots": "project_snapshots",
        "projmgmt":                       "projmgmt",
        "portfolios":                     "portfolios",
        "portviz":                        "portviz",
        "snapshots":                      "snapshots",
        "snapshots/:snap_id":             "snapshots",
        "snapshots/:snap_id/refreshes":   "refreshes",
        "variables":                      "variables",
        "users":                          "users",
        "refreshes":                      "refreshes",
        "metrics":                        "metrics",
        "*url":                           "def",
    },
    def: function(url) {
        console.log("redirecting to home from requested url " + url);
        App.app.navigate("", true);
    },
    home: function () {
        App.main.setContent('home', function(el) { 
            return new App.HomeView({el: el}); 
        });
    },
    admin: function () {
        App.main.setContent('admin', function(el) { 
            return new App.AdminView({ el: el }); 
        });
    },
    content: function () {
        App.main.setContent('content', function(el) { 
            return new App.ContentView({ el: el }); 
        });
    },
    portviz: function () {
        App.main.setContent('portviz', function(el) { 
            return new App.PortVizView({ el: el }); 
        });
    },
    projmgmt: function (filter) {
        console.log('route projmgmt')
        console.log('filter: ' + filter)
        App.main.setContent('projmgmt', function(el) {
            //if (filter) {
            //    App.projsList.filter = filter 
            //} else {
            //    App.projsList.filter = ""
            //}
            return new App.ProjectsView({
                el: el, 
                metaModel: App.projAttrs,
                filterview: function(el) {
                    return new App.FilterView({
                        el: el,
                        filter: filter,
                        metaModel: App.projAttrs
                    });
                },
                listview: function(el) { 
                    return new App.ProjMgmtListView({
                        el: el,
                        filter: filter,
                        metaModel: App.projAttrs,
                        model: App.projsList,
                    }); 
                }
            }); 
        });
    },
    // filter is like eq(x,y)
    projects: function (filter) {
        console.log('route projects')
        console.log('filter: ' + filter)
        App.main.setContent('projects', function(el) {
            //if (filter) {
            //    App.projsList.filter = filter 
            //} else {
            //    App.projsList.filter = ""
            //}
            return new App.ProjectsView({
                el: el, 
                metaModel: App.projAttrs,
                filterview: function(el) {
                    return new App.FilterView({
                        el: el,
                        filter: filter,
                        metaModel: App.projAttrs
                    });
                },
                listview: function(el) { 
                    return new App.ProjectListView({
                        el: el,
                        filter: filter,
                        metaModel: App.projAttrs,
                        model: App.projsList,
                    }); 
                }
            }); 
        });
    },
    // TODO: replace this with what it should be:
    // a summary of a single project, not a filtered list.
    project: function (projid, params) {
        console.log('route project')
        App.main.setContent('projects', function(el) {
            if (projid) {
                App.projsList.filter = "eq(project_id," + projid + ")"
            } else {
                App.projsList.filter = ""
            }
            return new App.ProjectsView({
                el: el, 
                metaModel: App.projAttrs,
                filterview: function(el) {
                    return new App.FilterView({
                        el: el,
                        filter: filter,
                        metaModel: App.projAttrs
                    });
                },
                listview: function(el) { 
                    return new App.ProjectListView({
                        el: el,
                        filter: filter,
                        metaModel: App.projAttrs,
                        model: App.projsList,
                    }); 
                }
            }); 
        });
    },
    portfolios: function (filter) {
        console.log('route portfolios')
        App.main.setContent('portfolios', function(el) {
            return new App.PortfoliosView({
                el: el,
                metaModel: App.portAttrs,
                filterview: function(el) {
                    return new App.FilterView({
                        el: el,
                        filter: filter,
                        metaModel: App.portAttrs,
                    });
                },
                listview: function(el) {
                    return new App.PortfolioListView({ 
                        el: el, 
                        filter: filter,
                        metaModel: App.portAttrs,
                        model: App.portsList,
                    }); 
                }
            }); 
        });
    },
    project_snapshots: function (projid) {
        App.main.setContent('snapshots', function(el) {
            if (projid) {
                App.snapsList.filter = "eq(project_id," + projid + ")"
            } else {
                App.snapsList.filter = ""
            }
            return new App.SnapshotsView({
                el: el,
                snaplist: function(el) {
                    return new App.SnapListView({
                        el: el,
                        model: App.snapsList
                    });
                }
            }); 
        });
    },
    snapshots: function (snapid) {
        App.main.setContent('snapshots', function(el) {
            if (snapid) {
                App.snapsList.filter = "eq(snapshot_id," + snapid + ")"
            } else {
                App.snapsList.filter = ""
            }
            return new App.SnapshotsView({
                el: el,
                snaplist: function(el) {
                    return new App.SnapListView({
                        el: el,
                        model: App.snapsList
                    });
                }
            }); 
        });
    },
    variables: function () {
        App.main.setContent('variables', function(el) {
            return new App.VariablesView({
                el: el,
                snaplist: function(el) {
                    return new App.VariableListView({
                        el: el,
                        model: App.variablesList
                    });
                }
            }); 
        });
    },
    users: function () {
        App.main.setContent('users', function(el) {
            return new App.UsersView({
                el: el,
                userlist: function(el) {
                    return new App.UserListView({
                        el: el,
                        model: App.usersList
                    });
                }
            }); 
        });
    },
    refreshes: function (snapid) {
        App.main.setContent('refreshes', function(el) {
            if (snapid) {
                App.refreshList.filter = "eq(snapshot_id," + snapid + ")"
            } else {
                App.refreshList.filter = ""
            }
            return new App.RefreshView({
                el: el,
                content: function(el) {
                    return new App.RefreshListView({
                        el: el,
                        model: App.refreshList 
                    }); 
                }
            });
        });
    },
    metrics: function () {
        App.main.setContent('metrics', function(el) { 
                    return new App.MetricsView({
                        el: el,
                        content: function(el) {
                            return new App.MetricsListView({
                                el: el,
                                model: App.metricsList
                            }); 
                        }
                    }); 
        });
    },
});

// this global singleton fetch starts here, but doesn't need to
// complete until it's needed.

var succfn = function(name) {
    return function() {
        console.log(name + ' success'); 
    };
};

var failfn = function(name) {
    return function(origmodel, resp, options) {
        console.log(name + ' error'); 
        console.log(origmodel); 
        console.log(resp); 
        console.log(options); 
        throw name + 'fail'
    };
};

// what we always want is to call back with some action on the list.
// we don't really want to expose the jqxhr, so don't.
var defer = function(name, list) {
    /** @private */ var deferred = list.pager();
    deferred.done(succfn(name));
    deferred.fail(failfn(name));
    return {
        list: list,
        /**
         * invoke the fn with the list; this should return
         * a function that is passed to the callback registry.
         * 
         * @param {function(list) : function} x
         */
        defer: function(x) {
            deferred.done(x(list))
        }
    }
};

// attr metadata
// (not the attr data itself)
// these encapsulate the collection and its
// jqxhr, to allow callbacks on its fetch
/** @type {async-collection} */
App.projAttrs = new App.Attrs();
//App.projAttrs = defer('projattrs', new App.Attrs());
App.portAttrs = new App.PortAttrs();
//App.portAttrs = defer('portattrs', new App.PortAttrs());
App.users = defer('users', App.usersList); 


// wait for DOM-ready so IE doesn't freak out
$(function(){
    App.app = new App.AppRouter();
    Backbone.history.start();
})

