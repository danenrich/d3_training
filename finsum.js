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

 

    //$('#Financial_summary_c tr:even td:not(:first-child)').css("background-color", "purple");

    $('#Financial_summary_c td').hover(function() {
        $(this).parent("tr").css("background-color", "yellow");
    },
        function() {
            $(this).parent("tr").css("background-color", "white");

        }
    );
    //Create total column
	    //Add total column
			$('<td>Totals</td>').appendTo('#Financial_summary_c tr:eq(0)');
	    $('<td></td>').appendTo('#Financial_summary_c tr:gt(0)');
			
			//Format all the cells
			$("#Financial_summary_c td:last-child").addClass(function() {
				return $(this).prev().attr('class');
			});
			
			//Drop in totals
			$("#Financial_summary_c tr:gt(0)").each(function() {
				var sum = 0;
				//$(this).children(":not(:last-child)").each(function() {
				$(this).children().not(":first").not(":last").each(function() {
					var temp = 0;
					//sum += parseInt($(this).html().replace(/[^0-9\.-]+/g, "0"), 10);
					temp = parseInt($(this).html().replace(/[^0-9\.-]+/g, ""), 10);
					//temp = parseInt($(this).html().replace(/[^0-9\.-]+/g, 0),10);
					sum = isNaN(temp) ? sum : sum+=temp;
				});
				sum = sum===0 ? "" : "$" + sum;
				$(this).children(":last-child").text(sum);
			});
		
		var $bigcells = $('#Financial_summary_c td').filter(function () {
    	return parseInt($(this).html().replace(/[^0-9\.\(\)-]+/g, ""), 10) > 0;
    }).css("color", "blue");
});