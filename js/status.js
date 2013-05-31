window.StatusModel = Backbone.Model.extend();

window.Metrics = Backbone.Collection.extend({
    model: StatusModel,
    url: "../RestStatus/models/"
});

window.ListView = Backbone.View.extend({
    el: $('#mainArea'),
    initialize: function () {
        this.model.bind("reset", this.render, this);
    },
    render: function (eventName) {
        _.each(this.model.models, function (x) {
            $(this.el).append(new ListItemView({ model: x }).render().el);
        }, this);
        return this;
    }
});

window.ListItemView = Backbone.View.extend({
    tagName: "li",
    template: _.template($('#list-item').html()),
    render: function (eventName) {
        console.log("foo")
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }
});

var AppRouter = Backbone.Router.extend({
    routes: {
        "": "list"
    },

    list: function () {
        console.log('list');
        this.metricsList = new Metrics();
        this.metricsListView = new ListView({ model: this.metricsList });
        this.metricsList.fetch();
    }

});

var app = new AppRouter();
Backbone.history.start();