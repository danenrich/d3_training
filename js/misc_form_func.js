// misc_form_func.js
// Javascript routines to misc form manipulations



function getMax(v1,v2) {
  var mx = v1;
  if (v2 > v1) {
    mx = v2;
  }
  return mx;
}

function matchTableSizes(tableA,tableB) {
  var tblA = $('#' + tableA);
  var tblB = $('#' + tableB);
  var tblA_th = $('#' + tableA + ' th');
  var tblB_th = $('#' + tableB + ' th');
  var tablewidth1 = tblA.width();
  var tablewidth2 = tblB.width();

  tablewidth1 = getMax(tablewidth1, tablewidth2);
  tblA.width(tablewidth1);
  tblB.width(tablewidth1);

  var j = 0;
  tblA_th.each(function() {
    var width1 = $(this).width();
    var width2 = tblB_th.eq(j).width();
    // silly function to fix syntax issue
    width1 = getMax(width1, width2);
    tblA_th.eq(j).width(width1);
    tblB_th.eq(j).width(width1);
    j++;
  });
  tblA.css('table-layout', 'fixed');
  tblB.css('table-layout', 'fixed');
}


