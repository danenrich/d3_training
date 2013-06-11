$(document).ready(function () {
    /* Exercise 1
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

		//Exercise 2
	    $('#Financial_summary_c td').hover(function() {
	        $(this).parent("tr").css("background-color", "yellow");
	    },
	        function() {
	            $(this).parent("tr").css("background-color", "white");
	
	        }
	    );
	    
	    //Create total column
		    //Add total column
				$('<th>Totals</th>').appendTo('#Financial_summary_c tr:eq(0)');
		    $('<td></td>').appendTo('#Financial_summary_c tr:gt(0)');
				
				//Format all the cells
				$("#Financial_summary_c td:last-child, th:last-child").addClass(function() {
					return $(this).prev().attr('class');
				});
				
				//Drop in totals
				$("#Financial_summary_c tr:gt(0)").each(function() {
					var sum = 0;
					$(this).children().not(":first").not(":last").each(function() {
						var temp = 0;
						temp = parseInt($(this).html().replace(/[^0-9\.-]+/g, ""), 10);
						sum = isNaN(temp) ? sum : sum+=temp;
					});
					sum = sum===0 ? "" : "$" + sum;
					$(this).children(":last-child").text(sum);
				});
			
			var $bigcells = $('#Financial_summary_c td').filter(function () {
	    	return parseInt($(this).html().replace(/[^0-9\.\(\)-]+/g, ""), 10) > 0;
	   	}).css("color", "blue");
	  
	  //Exercise 3
			//Build the second table
			$("#Financial_summary_c").parents("div").append($("#Financial_summary_c").clone());			
			$("table").not("#Financial_summary_c:first").attr("id","tabletwo");
			//$("#tabletwo td").css("background-color","red");
						
			//Build the ratios table
			$("#tabletwo").parents("div").append($("#tabletwo").clone());			
			$("table").not("#tabletwo:first").not("#Financial_summary_c:first").attr("id","ratios");
			//$("#ratios td").css("background-color","yellow");
			
			//Modify the values of the second table by multiplying each cell by its position
			$("#tabletwo tr:gt(0)").each(function() {
				$(this).children().not(":first").each(function() {
					var num = 0;
					num = parseInt($(this).html().replace(/[^0-9\.-]+/g, ""), 10);
					num = isNaN(num) ? "" : "$" + (num*$(this).index()).toFixed(0);
					$(this).text(num);
				});						
			});

			//Create the ratios in table three
			$("#ratios tr:gt(0)").each(function() {
				$(this).children().not(":first").each(function() {
					var numerator = 0;
					var denominator = 0;
					numerator = parseInt($(this).html().replace(/[^0-9\.-]+/g, ""), 10); //Table 3 has table 1's values, so that's our numerator
					var rowpos = $(this).parent("tr").index();
					var colpos = $(this).index();
					var denominator = parseInt($("#tabletwo tr:eq("+rowpos+") td:eq("+colpos+")").html().replace(/[^0-9\.-]+/g, ""), 10);
					$(this).text(isNaN(denominator) ? "" : (100*numerator/denominator).toFixed(0) + "%");
				});						
			});				

});
