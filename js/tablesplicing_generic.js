// $File: //dev/EPS/js/tablesplicing_generic.js $
// $DateTime: 2012/04/02 12:06:44 $
// $Revision: #7 $
// $Author: matt $

jQuery.moveRow = function(anchorRow, theRow) {
  var newRow = {};
  jQuery.extend(true, newRow, theRow);
  anchorRow.after(newRow);
};

//addCelltoRow adds a cell to the end of a row
jQuery.addCelltoRow = function(anchorRow, theCell) {
  var newCell = {};
  jQuery.extend(true, newCell, theCell);
  $('th:last, td:last', anchorRow).after(newCell);
};

//addCelltoFrontofRow adds a cell to the front of a row
jQuery.addCelltoFrontofRow = function(anchorRow, theCell) {
  var newCell = theCell.clone();
  $('th:eq(0), td:eq(0)', anchorRow).before(newCell);
  theCell.remove();
};

//addCelltoRowMiddle adds a cell at the specified position in a row
jQuery.addCelltoRowMiddle = function(anchorRow, theCell, j) {
  var newCell = theCell.clone();
  $('th:eq(' + j + '), td:eq(' + j + ')', anchorRow).after(newCell);
  //theCell.remove();
};
//padCells adds 'j' cells to the specified row
//the function was intended to aid in keeping tables
//rectangular
jQuery.padCells = function(anchorRow, theCell, j) {
  var newCell = theCell.clone();
  var lastCell = $('th:last, td:last', anchorRow);
  for (i = 0; i < j; i++) {
    $(lastCell).after(newCell);
  }
  //theCell.remove();
};

jQuery.padCellsinFront = function(anchorRow, theCell, j) {
  var newCell = theCell.clone();
  var lastCell = $('th:eq(0), td:eq(0)', anchorRow);
  for (i = 0; i < j; i++) {
    $(lastCell).before(newCell);
  }
  //theCell.remove();
};

jQuery.befRow = function(anchorRow, theRow) {
  var newRow = theRow.clone();
  anchorRow.before(newRow);
  theRow.remove();
};

// moveRows moves all rows from 'theTable' and places them
// after 'anchorRow' in another table
jQuery.moveRows = function(anchorRow, theTable) {
  var j;
  var i = $('tr', theTable).length;
  for (j = 0; j < i; j++) {
    $.moveRow($(anchorRow), $('tr:last', theTable));
  }
};

// moveBodyRows moves all rows except the header row
// from 'theTable' and places them after 'anchorRow' in another table
// the header row from 'theTable' is deleted
jQuery.moveBodyRows = function(anchorRow, theTable) {
  // first delete the first row in the table
  $('tr:eq(0)', theTable).remove();
  // now we can move the entire table
  $(anchorRow).after($('tr', theTable));
};

// appendTotalsWithHeader moves totals cells to the end of the designated rows
// it assumes that the first row is a header row with header elements (<th>)
// the first argument is the set of rows you want to append to
// the second argument is the set of rows that have the totals cells at the end of each row
jQuery.appendTotalsWithHeader = function(valueRows, totalRows) {
  var j;
  var i = $(valueRows).length;
  $.addCelltoRow($(valueRows[0]), $('th:last', totalRows[0]));

  for (j = 1; j < i; j++) {
    $.addCelltoRow($(valueRows[j]), $('td:last', totalRows[j]));
  }
};

// appendTotals moves totals cells to the end of the designated rows
// it assumes that the first row is NOT a header row with header elements (<th>)
// the first argument is the set of rows you want to append to
// the second argument is the set of rows that have the totals cells at the end of each row
jQuery.appendTotals = function(valueRows, totalRows) {
  var j;
  var i = $(valueRows).length;
  for (j = 0; j < i; j++) {
    $.addCelltoRow($(valueRows[j]), $('td:last', totalRows[j]));
  }
};

// prependTotals... moves totals cells to the front of the designated rows
jQuery.prependTotalsWithHeader = function(valueRows, totalRows) {
  var j;
  var i = $(valueRows).length;
  $.addCelltoFrontofRow($(valueRows[0]), $('th:last', totalRows[0]));

  for (j = 1; j < i; j++) {
    $.addCelltoFrontofRow($(valueRows[j]), $('td:last', totalRows[j]));
  }
};

jQuery.prependTotals = function(valueRows, totalRows) {
  var j;
  var i = $(valueRows).length;
  for (j = 0; j < i; j++) {
    $.addCelltoFrontofRow($(valueRows[j]), $('td:last', totalRows[j]));
  }
};

// spliceCols takes the rows from totalRows and splices them into valueRows at column position k
// if you want to prepend a single column to the front of
// a table, use prependTotals or prependTotalsWithHeader instead
jQuery.spliceCols = function(valueRows, totalRows, k) {
  k = k - 1;
  var numCols = $('th, td', totalRows[0]).length;
  var numRows = $(valueRows).length;
  var i, j, curPos, theCell, newCell;
  for (i = 0; i < numRows; i++) {
    curPos = $('th:eq(' + k + '), td:eq(' + k + ')', valueRows[i]);
    for (j = numCols; j > 0; j--) { //We always ignore the first element in the row, assuming it is a header cell
      theCell = $('td:eq(' + j + '), th:eq(' + j + ')', totalRows[i]);
      var newCell = {};
      $.extend(true, newCell, theCell);
      $(curPos).after(newCell);
    }
  }
};

// appendTables moves an entire table of data, except for the row header column,
// to the right-most edge of a parent table, joining them seamlessly.
// this function requires that the first row of each table use TH elements instead of TD elements.
// the first argument is the parent table, which will be the left-hand table
// the second argument is the child table, which will be appended to the right of the parent table
jQuery.appendTables = function(leftTable, rightTable) {

  var theLeftRows = $('tr', leftTable);
  var theRightRows = $('tr', rightTable);

  // first delete the first child of every tr in the right table
  $('th:first, tr td:first-child', rightTable).remove();

  // now push the inner html of each row into the left table
  for (var m = $(theLeftRows).length - 1; 0 <= m; m--) {
    $(theLeftRows[m]).append($(theRightRows[m]).children());
  }
};

// trial at a faster appendTables routine that uses fewer
// JS commands
jQuery.appendTablesFast = function(leftTable, rightTable) {
	
	var theLeftRows = $('tr', leftTable);
	var theRightRows = $('tr', rightTable);
	var m;
	
	// first delete the first child of every tr in the right table
	$('th:first, tr td:first-child', rightTable).remove();
	
	// now push the inner html of each row into the left table	
	for(m=$(theLeftRows).length-1; 0<=m; m--) {
			$(theLeftRows[m]).append($(theRightRows[m]).children());
		}
};

timer = {
  _map: {},
  start: function(msg) {
    this._map[msg] = new Date().getTime();
  },
  end: function(msg) {
    this._map[msg] = new Date().getTime() - this._map[msg];
    return this._map[msg];
  },
  show: function(msg) {
    console.log('---------> ' + msg + ': ' + this._map[msg]);
  }
};
// usage:
// timer.start("first test");
// alert(timer.end("first test"));

// set a specific select option as the active selection
// this function should no longer be used since we only needed it when
// cloning nodes instead of moving them.
function setSelectChoice(objName, idxVal) {
  var selectObj;
  selectObj = $('[name=' + objName + ']');
  selectObj.selectedIndex = (idxVal - 1);
  selectObj[0].options[(idxVal - 1)].selected = true;
}
