// fake REST server, intercepts ajax calls
window.Server = {};

// fix up the urls used by the collections
// this is a total hack, also not really necessary.
App.baseurl = ""

Server.rowcount = 1000;

// represents the attributes.xml file, say, projatt.  just for playing around.
Server.attrsdata = function() {
    return [
        { rank:'0', id: 'desc', name: 'Description', type: 'shorttext', list_view:'200', filter:'true'  },
        // not visible in filters
        { rank:'3', id: 'asmt', name: 'Assumptions', type: 'longtext' },
        // also not visible in filters
        { rank:'4', id: 'own', name: 'Manager',  type: 'users', filter:'true' },
        { rank:'6', id: 'stage', name: 'Stage', type: 'pulldown', list_view:'20', filter:'true',
          options: [
            {id:'1', name:'Group 1', foo:'b1r'},
            {id:'2', name:'Group 2', foo:'b2r'},
            {id:'3', name:'Group 3', foo:'b3r'},
            {id:'4', name:'Group 4', foo:'b4r'},
          ]
        }
    ]
}();

Server.projsdata = function() {
  var projsdata = []
  for (i=0; i< Server.rowcount; ++i) {
    projsdata.push( {
      "project_id": i,
	  "creator_id": 1,
	  "create_time": new Date(new Date().getTime() - 60000),
	  "name": "Project " + i,
      "attributes": {
        "foo": {
          "project_id": i,
          "att_name": "foo",
          "att_value": "bar"
        },
        "foob": {
          "project_id": i,
          "att_name": "foob",
          "att_value": "barb"
        },
      }
    })
  }
  return projsdata
}();

Server.portsdata = function() {
  var portsdata = []
  for (i=0; i< Server.rowcount; ++i) {
    portsdata.push( {
        "portfolio_id": i,
	    "creator_id": 1,
	    "project_id": 1,
	    "create_time": new Date(new Date().getTime() - 60000),
	    "name": "Portfolio " + i,
	    "populated": (Math.random() > 0.5) ? true : false,
    })
  }
  return portsdata
}();

Server.snapsdata = function() {
  var snapsdata = []
  for (i=0; i< Server.rowcount; ++i) {
    snapsdata.push( {
        "snapshot_id": i,
	    "creator_id": 1,
	    "project_id": Math.round(i/4),
	    "approved": true,
	    "creation_time": new Date(new Date().getTime() - 60000),
	    "snapshot_name": "snap " + i,
	    "proj_temp_id": 1,
	    "default_data": true,
	    "publish_data": true,
	    "workspace_data":true,
	    "populated": (Math.random() > 0.5) ? true : false,
	    "as_of": true,
	    "proxy": 0 ,
	    "latest":false,
	    "failed": (Math.random() > 0.5) ? true : false,
    })
  }
  return snapsdata
}();

Server.usersdata = function() {
  var usersdata = []
  for (i=0; i< Server.rowcount; ++i) {
    usersdata.push( {
        "user_id": i,
	    "name": "user name " + i,
    })
  }
  return usersdata
}();

Server.snapvarsdata = function() {
  var snapvarsdata = []
  for (i=0; i< Server.rowcount; ++i) {
    snapvarsdata.push( {
        "snapshot_id": i,
	    "variable_name": "foo",
	    "variable_type": "I",
	    "uri": "http://foo/",
    })
  }
  return snapvarsdata
}();

Server.verylong = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi adipiscing, dui eget euismod tincidunt, nulla nulla fringilla dui, eget vehicula turpis nisl pulvinar lorem. Cras tempus magna mollis sapien tincidunt tristique. Nulla ornare libero at augue scelerisque adipiscing. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Proin feugiat velit non diam convallis sed hendrerit sem euismod. Aenean at hendrerit augue. Pellentesque mi enim, interdum quis iaculis eget, venenatis a leo. Vivamus sit amet urna dui. Nam tempus, magna eu feugiat tincidunt, tortor arcu ultricies nisi, eu lobortis orci eros quis massa. Vestibulum a leo ipsum. Donec in ultrices diam. Maecenas eu lacus vel erat dapibus accumsan. Suspendisse potenti. Nam tempor turpis quis dui porttitor vel ornare justo pulvinar. Integer sit amet ultrices arcu.  Morbi a posuere mauris. Phasellus dignissim pellentesque nibh, et hendrerit odio pellentesque iaculis. Etiam auctor ultrices libero metus."

Server.refreshdata = function() {
  var refreshdata = []
  var start_time =  new Date();
  for (i=0; i< Server.rowcount; ++i) {
    var start_time = new Date(start_time.getTime() + Math.random() * 60000);
    var end_time =  new Date(start_time.getTime() + Math.random() * 120000);
    refreshdata.push( {
        "id" : i,
        "snapshot_id": Math.round(i/3),
        "source": "foo",
        "start_time": start_time,
        "end_time": end_time,
	    "status": (Math.random() > 0.5) ? 200 : 500,
        "message": Server.verylong
    })
  }
  return refreshdata
}();

// Intercept all ajax calls.  this code
// could almost run in a node server.
//
// i'm not super happy about putting the metadata
// in here, but i wouldn't be happy about doing
// additional requests either.  Some folks use the
// http range header, apparently unaware that it
// means BYTE range.

Server.getQs = function(data) {
    var result = {}
    if (!data) return result;
    var vars = data.split('&');
    for (var i = 0; i < vars.length; ++i) {
        var pair = vars[i].split('=');
        result[pair[0]] = pair[1]
    }
    return result;
};


// uses the query string:
//
// ?limit=a&skip=b&order=c&filter=d
//
Server.makeResult = function(dataset, data) {
    var qs = Server.getQs(data);
    // an integer >= 0
    var limit = parseInt(qs['limit']) || 10
    if (limit < 0) limit = 0;
    // an integer >= 0
    var skip = parseInt(qs['skip']) || 0
    if (skip < 0) skip = 0;
    // the field to order by, asc
    // TODO: desc, and multiple fields
    var order = qs['order'] || ""

    var filter = qs['filter'] || ""

    console.log('filter ' + filter)

    // expression, e.g.:
    // filter=project_id:[foo],create_time:[bar-baz]

    // use cube-like expressions,
    // filter=eq(project_id,"foo").gt(create_time,bar).lt(create_time,baz)

    // for now, just allow 'eq'.  fields are not quoted, string values are.
    var eqs = []
    if (filter.substring(0,2) == 'eq') {
        var eqf = filter.substring(3, filter.length - 1);
        var eqs = eqf.split(",");
    };


    // just use regex here instead of peg, 
//     var re = /foo_(\d+)/g,
 //    str = "text foo_123 more text foo_456 foo_789 end text",
  //   match,
   //  results = [];

// while (match = re.exec(str))
//     results.push(+match[1]);





    var result = {}

    // first filter
    if (eqs.length > 0) {
        result.data = dataset.filter(function(row) {
            if (row[eqs[0]] == eqs[1]) return true;
            return false;
        } );
    } else {
        result.data = dataset.slice(0)
    }

    var dir = 1
    if (order.substring(0,1) == "-") {
        order = order.substring(1, order.length)
        dir = -1
    }
    // then sort
    result.data.sort(function(a,b) {
        if (a[order] > b[order]) return 1 * dir;
        if (a[order] < b[order]) return -1 * dir;
        return 0;
    } );

    // result summary.  total rows is rows *matching the filter*
    result.totalRows = result.data.length
    result.startRow = skip
    var end = skip + limit
    if (end > result.data.length) { end = result.data.length; }
    result.endRow =  end

    // then select just the result rows
    result.data = result.data.slice(skip, end)

    // unique values for each column
    result.columns = {};
    dataset.forEach( function(row) {
        for (col in row) {
            if (! (col in result.columns)) {
                result.columns[col] = [];
            }
            if (result.columns[col].indexOf(row[col]) == -1) {
                result.columns[col].push(row[col]);
            }
        }
    });

    return result;
};

(function($){
  $.ajax = function(params){
    if (params.type === "GET") {
      console.log("server GET");
      console.log(params);
      if (params.url === "portfolios/") {
        params.success(
          Server.makeResult(Server.portsdata, params.data)
        );
        return $.Deferred();
      } else if (params.url === "projattrs/") {
        params.success(
          Server.makeResult(Server.attrsdata, params.data)
        );
        return $.Deferred();
      } else if (params.url === "projects/") {
        params.success(
          Server.makeResult(Server.projsdata, params.data)
        );
        return $.Deferred();
      } else if (params.url === "refreshes/") {
        params.success(
          Server.makeResult(Server.refreshdata, params.data)
        );
        return $.Deferred();
      } else if (params.url === "snaps/") {
        params.success(
          Server.makeResult(Server.snapsdata, params.data)
        );
        return $.Deferred();
      } else if (params.url === "users/") {
        params.success(
          Server.makeResult(Server.usersdata, params.data)
        );
        return $.Deferred();
      } else if (params.url === "snapvars/") {
        params.success(
          Server.makeResult(Server.snapvarsdata, params.data)
        );
        return $.Deferred();
      } else if (params.url === "../RestStatus/models/") {
        params.success(
          [{key:"some_metric", value:"2.0"},
          {key:"another_metric", value:"4.0"}]
        );
        return $.Deferred();
      }
    }
    console.log("server error: " + params.url);
    params.error();
    return $.Deferred();
  };
})(jQuery);
