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
    $('#Financial_summary_c td').filter(function () {
        //return parseInt($(this).val().replace("$", ""), 10) > 0;
        return $(this).html === "$20";
    }).css("color", "blue");

    $('#Financial_summary_c td').each(function () {
        $(this).click(function () {
            //alert($(this).html);
            if ($(this).html === "see me") {
                var $var = "Yes";
            }
            else { var $var = "No"; }
            $(this).html($var);
        });
    });
    $('#Financial_summary_c td:contains("see me")').each(function () {
        $(this).css("color", "blue");
        var $len = $(this).text;
        $(this).html($len);
    });

    /*
    $bigcells.hover(function () {
    $(this).css("color", "blue");
    });
    */
});