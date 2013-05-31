
// $File: //dev/EPS/js/jquery.aligntabcols.js $ 
// $DateTime: 2011/05/16 10:35:10 $ 
// $Revision: #4 $ 
// $Author: matt $ 

// requires file:  array.prototypes.js

function matchTableSizes() {
   var k = 0;
   var argArray = new Array();
   var tables = new Array();
   for (var i=0; i<arguments.length; i++) {
    var argObj = $('#' + arguments[i]);
    if (!argObj || argObj.length == 0) continue;
    else {
     argArray[k] = arguments[i];
     tables[k++] = argObj;
    }
   }
   var tbl_th = new Array();
   var tblWidth = new Array();
   for (i=0; i<argArray.length; i++) {
     tbl_th[i] = $('#' + argArray[i] + ' th');
     tblWidth[i] = tables[i].width();
    }
    
    tablewidth1 = tblWidth.max();
    
    for (i=0; i<argArray.length; i++)
     tables[i].width(tablewidth1);
    
    var j = 0;
    var thWidths = new Array();
    tbl_th[0].each(function() {
     thWidths[0] = $(this).width();
     for (i=1; i<argArray.length; i++)
      thWidths[i] = tbl_th[i].eq(j).width();
      width1 = thWidths.max();
     for (i=0; i<argArray.length; i++)
      tbl_th[i].eq(j).width(width1);
     j++;
   });
   
   for (i=0; i<argArray.length; i++)
    tables[i].css('table-layout','fixed');
};

    
