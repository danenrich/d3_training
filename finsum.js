$(document).ready(function () {
    /* exercise 1
    $("#Financial_summary_c tr:gt(0) td:gt(0)").addClass("interiorCells");
    $("#Financial_summary_c th").addClass("headers");
    $("#Financial_summary_c tr td:first-child").addClass("headers");
    $("#Financial_summary_c td, th").css("padding", "0px");
    $("#Financial_summary_c .corner").css("visibility", "hidden");
    */
    /*
    var $bigcells = $('#Financial_summary_c td').filter(function () {
    return parseInt($(this).val().replace("$", ""), 10) > 0;
    });
    
    $("$bigcells").addClass("blueText");
    $("$bigcells").each(function () {
    alert("You got me!");
    });
    */

    var $bigcells = $('#Financial_summary_c td').filter(function () {
        return parseInt($(this).html().replace(/[^0-9\.\(\)-]+/g, ""), 10) > 0;
    }).css("color", "blue");

    //$('#Financial_summary_c tr:even td:not(:first-child)').css("background-color", "purple");

    $('#Financial_summary_c td').hover(function() {
        $(this).parent("tr").css("background-color", "yellow");
    },
        function() {
            $(this).parent("tr").css("background-color", "white");

        }
    );
});