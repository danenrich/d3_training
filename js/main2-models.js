// model types

App.ProjectModel = Backbone.Model.extend({
    idAttribute: "project_id",
    parse: function(resp, xhr) {
        resp.create_time = new Date(resp.create_time)
        //console.log(resp)
        resp.last_publication = new Date(resp.last_publication)
        return resp;
    }
});

App.PortfolioModel = Backbone.Model.extend({
    idAttribute: "portfolio_id",
    parse: function(resp, xhr) {
        resp.create_time = new Date(resp.create_time)
        return resp;
    }
});

App.SnapModel = Backbone.Model.extend({
    idAttribute: "snapshot_id",
    parse: function(resp, xhr) {
        resp.creation_time = new Date(resp.creation_time)
        resp.refresh_time = new Date(resp.refresh_time)
        return resp;
    }
});

App.RefreshModel = Backbone.Model.extend({
    idAttribute: "id",
    parse: function(resp, xhr) {
        resp.start_time = new Date(resp.start_time)
        resp.end_time = new Date(resp.end_time)
        return resp;
    }
});

App.StatusModel = Backbone.Model.extend();

App.VariableModel = Backbone.Model.extend();

App.UserModel = Backbone.Model.extend({
    idAttribute: "user_id",
});

App.AttrModel = Backbone.Model.extend({
    toString : function() {
        return name;
    }
});

// client side only
App.FilterModel = Backbone.Model.extend();
