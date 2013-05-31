function foo() {
    $.getJSON('../doc/data.txt', function (data) {
        var results = data.results;
        var items = [];

        $.each(results, function (key, val) {
            // TODO: this uses the field names, which is bad.
            // it's not bad to use them; it just shouldn't be here in the js function.
            items.push('<li id="' + key + '">' +
                val.given_name + ' ' +
                val.middle_initial + ' ' +
                val.surname + ' ' +
                '</li>');
        });

        $('<ul/>', {
            'class': 'my-new-list',
            html: items.join('')
        }).appendTo('body');
    });
}

function showParms() {
    $('<ul/>', {
        'class': 'my-new-list',
        html: 'foo is: ' + getParameterByName('foo')
    }).appendTo('body');
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.search);
    if (results == null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}

$(document).ready(function() {
    foo()
    showParms()
})