

// Support functions
// Feature: Copy for Clipboard into non-grids input table
//          table resizing
//     special event controls

// output_types.xsl defines global vars for fields used
/*
   var myTestDiv = document.getElementById('mytestdiv');
   var myTestTd = document.getElementById('mytesttd');
   var myTestTd2 = document.getElementById('mytesttd2');
*/


// Special vars to hold internal limiters / offsets for table col size processing
var minColWidth = 20;  // min size for a column
var checkLimiter = 2;     // min char length before checking realsize
var cellWidthOffSet = 6;
var selectWidthOffSet = 28;

// Special vars to hold arrays of filter info for clipboard processing
var colVals = {};
var rowVals = {};
var origVals = {};
var ieCompat = (navigator.userAgent.indexOf('MSIE') != -1);
var hdrHash = new Array();
var cellHash = new Array();
var tablesToResize = new Array();
var initialRender = 1;
var tableGroups = new Array();
var CopyPastON = false;   // during copy paste operations we need to skip fch validation

function ToggleSelect(obj) {
  if (allTextSelected(obj)) {
    var myTempVal = obj.value;
    obj.value = '';
    obj.value = myTempVal;
    return true;
  } else {
    obj.select();
    return false;
  }
}

var pastePointAllSelected = false;

function InputKeyPress(obj,e) {
  var kVal = String.fromCharCode(e.which);
  var pressedKey = String.fromCharCode(e.keyCode).toLowerCase();

  if ((kVal == 'v' && e.ctrlKey) || (e.ctrlKey && pressedKey == 'v') || (e.metaKey && pressedKey == 'v')) {
    pastePointAllSelected = (allTextSelected(obj));
    if (window.clipboardData) {
      document.forms[0].pastePoint.value = clipboardData.getData('Text');
    } else {
      document.forms[0].pastePoint.focus();
    }
    setTimeout("ProcessClip('" + obj.id + "','pastePoint')", 250);
  } else {
    if (e.keyCode == 13) { // enter will put cursor at front of cell
      if (obj.className == 'expanding') {
        if (allTextSelected(obj)) {
          ToggleSelect(obj);
          return false;
        } else {
          return true;
        }
      } else {
        ToggleSelect(obj);
        return false;
      }
    } else if (e.keyCode == 27 && !obj.options) {
      obj.blur();
      obj.value = origVals[obj.name];
      resizeCol(obj);
      makeSelected(obj.name);
      return false;
    } else if (e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 39 || e.keyCode == 37) { //cursor keys
      tmp = obj.id.split('_id');
      rootName = tmp[0];
      tmp = tmp[1].split('_');
      x = tmp[0];
      y = tmp[1];
      rows = rowVals[rootName].split(' ');
      cols = colVals[rootName].split(' ');
      if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        if (jQuery.datepicker) $(obj).datepicker('hide'); // if there is a datepicker rendered we away from this cell
        switch (e.keyCode) {
          case 38:  // up
            if (obj.className == 'ui-autocomplete-input') { return false; } else;
            if (allTextSelected(obj) || obj.tagName == 'INPUT') {
              if (rows.findIndex(x) != 0) {
                makeSelected(rootName + '_id' + rows[rows.findIndex(x) - 1] + '_' + y);
              } else if (cols.findIndex(y) != 0) {
                makeSelected(rootName + '_id' + rows[rows.length - 1] + '_' + cols[cols.findIndex(y) - 1]);
              } else {
                makeSelected(rootName + '_id' + rows[rows.length - 1] + '_' + cols[cols.length - 1]);
              }
            } else { return true; }
            break;
          case 40: // down
            if (obj.className == 'ui-autocomplete-input') { return false; } else;
            if (allTextSelected(obj) || obj.tagName == 'INPUT') {
              if (rows.findIndex(x) != rows.length - 1) {
                makeSelected(rootName + '_id' + rows[rows.findIndex(x) + 1] + '_' + y);
              } else if (cols.findIndex(y) != cols.length - 1) {
                makeSelected(rootName + '_id' + rows[0] + '_' + cols[cols.findIndex(y) + 1]);
              } else {
                makeSelected(rootName + '_id' + rows[0] + '_' + cols[0]);
              }
            } else { return true; }
            break;
          case 39: //right
            if (allTextSelected(obj)) {
              if (cols.findIndex(y) != cols.length - 1) {
                makeSelected(rootName + '_id' + x + '_' + cols[cols.findIndex(y) + 1]);
              } else if (rows.findIndex(x) != rows.length - 1) {
                makeSelected(rootName + '_id' + rows[rows.findIndex(x) + 1] + '_' + cols[0]);
              } else {
                makeSelected(rootName + '_id' + rows[0] + '_' + cols[0]);
              }
            } else { return true; }
            break;
          case 37: // left
            if (allTextSelected(obj)) {
              if (cols.findIndex(y) != 0) {
                makeSelected(rootName + '_id' + x + '_' + cols[cols.findIndex(y) - 1]);
              } else if (rows.findIndex(x) != 0) {
                makeSelected(rootName + '_id' + rows[rows.findIndex(x) - 1] + '_' + cols[cols.length - 1]);
              } else {
                makeSelected(rootName + '_id' + rows[rows.length - 1] + '_' + cols[cols.length - 1]);
              }
            } else { return true; }
            break;
        } return false;
      }
    }
  }
}

function allTextSelected(InputObj) {
  if (selectedText(InputObj).length == InputObj.value.length) {
    return true;
  } else return false;
}

function selectedText(InputObj) {
  var startPos = InputObj.selectionStart;
  var endPos = InputObj.selectionEnd;
  var doc = document.selection;
  if (doc && doc.createRange().text.length != 0) {
    return (doc.createRange().text);
  }else if (!doc && InputObj.value.substring(startPos, endPos).length != 0) {
    return (InputObj.value.substring(startPos, endPos));
  } else {
    return '';
  }
}

function makeSelected(objId) {
  theObj = document.getElementById(objId);
  if (!theObj.options) {theObj.focus(); theObj.select();}
}


//  Process the Clipboard or pasted data
function ProcessClip(idName,pasteHolder) {
  CopyPastON = true;
  var obj = document.getElementById(idName);
  var dataBlock = document.getElementById(pasteHolder);
  var rootName, x, y, tmp;
  var xx, yy, rdat;
  var curInput;
  var curInputObj;
  var _x, _y;
  var colIdx = {};
  var rowIdx = {};
  var colOffSet, rowOffSet;
  var isTextArea, allSelected;
  var theVal;
  _x = 0;
  _y = 0;
  colOffSet = 0;
  rowOffSet = 0;
  isTextArea = (obj.nodeName == 'TEXTAREA');

  if ((dataBlock.value.indexOf('\t') > 0 || dataBlock.value.indexOf('\n') > 0)
     && (!isTextArea || (isTextArea && pastePointAllSelected))) {

    obj.value = '';
    var cdat = makeClipboardArray(dataBlock.value);
    if (cdat.length > 0) {
      obj.value = '';
      tmp = obj.id.split('_id');
      rootName = tmp[0];
      colIdx = colVals[rootName].split(' ');
      rowIdx = rowVals[rootName].split(' ');

      // Get Fields X and Y
      tmp = tmp[1].split('_');
      x = tmp[0];
      y = tmp[1];

      // find off-sets in Idxs
      for (xx = 0; xx <= rowIdx.length - 1; xx++) {
        if (rowIdx[xx] == x) {
          rowOffSet = xx;
        }
      }

      for (yy = 0; yy <= colIdx.length - 1; yy++) {
        if (colIdx[yy] == y) {
          colOffSet = yy;
        }
      }

      for (xx = 0; xx <= cdat.length - 1; xx++) {
        rdat = cdat[xx];
        for (yy = 0; yy <= rdat.length - 1; yy++) {
          _x = parseFloat(xx) + rowOffSet;
          _y = parseFloat(yy) + colOffSet;

          theVal = rdat[yy].trim();
          curInput = rootName + '_id' + parseFloat(rowIdx[_x]) + '_' + parseFloat(colIdx[_y]);

          curInputObj = document.getElementById(curInput);
          if (curInputObj != null) {

            updateCurrentInputObj(curInputObj, theVal, rootName);
          }
        }
      }
    }
    resizeTableCols(rootName);
  }
  else {
    if (pastePointAllSelected) {
      tmp = obj.id.split('_id');
      rootName = tmp[0];
      updateCurrentInputObj(obj, dataBlock.value.trim(), rootName);
    }
  }

  dataBlock.value = '';
  obj.focus();
  CopyPastON = false;
  return true;
}


function updateCurrentInputObj(curInputObj, theVal, rootName) {
  // check if current input object is a dropdown element (aka <select />)
  if (curInputObj.tagName == 'SELECT') {
    for (i = 0; i < curInputObj.length; i++) {
      if (curInputObj.options[i].text.toUpperCase() == theVal.toUpperCase()) {
        curInputObj.options[i].selected = true;
        i = curInputObj.length; // Exit for
      }
    }
  }
  else
  {
    curInputObj.value = theVal;
    curInputObj.focus();
  }
  //
  if (typeof fch == 'function') {
    // call to track table input field change
    fch(curInputObj, true, rootName);
  }

}
function makeClipboardArray(dataBlock) {
  var ca = new Array();
  var r, c, i, n;
  var _crlf = '\n'; //String.fromCharCode(10);  //+String.fromCharCode(10);
  var _tab = '\t'; //String.fromCharCode(9);
  if (!dataBlock.endsWith(_crlf)) {
    dataBlock = dataBlock + _crlf;
  }
  r = dataBlock.split(_crlf);
  for (i = 0; i <= r.length - 2; i++) {
    c = r[i].split(_tab);
    ca[i] = c;
  }
  return ca;
}

function testCellWidth(theString) {
  if (cellHash[theString]) {
    return cellHash[theString];
  } else {
    if (theString.length < checkLimiter) {
      compWidth = minColWidth;
    } else {
      myTestTd.innerHTML = theString;
      compWidth = (parseFloat(getComputedWidth(myTestTd)) + cellWidthOffSet);
    }
    cellHash[theString] = compWidth;
    return compWidth;
  }
}

function testHeaderWidth(header) {
  var compWidth, theString;
  theString = header.innerHTML;
  if (hdrHash[theString]) {
    // get cached value
    return hdrHash[theString];
  } else {
    if (theString.length < checkLimiter) {
      compWidth = minColWidth;
    } else {
      // copy css info from header into test td
      myTestTd2.innerHTML = theString;
      $(header).copyCSS('font-family font-size font-weight padding-left padding-right margin-left margin-right border-right border-left', myTestTd2);
      compWidth = (parseFloat($(myTestTd2).outerWidth(true)));
    }
    hdrHash[theString] = compWidth;
    return compWidth;
  }
}

function testSelectWidth(ele) {
  if (!ieCompat) {
    return testCellWidth(ele.options[ele.selectedIndex].text) + selectWidthOffSet;
  } else {
    var xx, thiswidth, maxwidth;
    maxwidth = 0;
    for (xx = 0; xx < ele.options.length; xx++) {
      thiswidth = testCellWidth(ele.options[xx].text) + selectWidthOffSet;
      if (maxwidth < thiswidth) maxwidth = thiswidth;
    }
    return maxwidth;
  }
}


function resizeCol(theInput) {
  //var thisHeader = document.getElementById(theHead);
  //theInput.style.width = thisHeader.style.width;
  var rootName, node, x, y, nn, tmp;
  var header, maxwidth;
  tmp = theInput.id.split('_id');
  rootName = tmp[0];
  var theMax, theMin;
  var thePad;
  theMax = MaxCol[rootName];
  theMin = MinCol[rootName];
  tmp = tmp[1].split('_');
  y = tmp[1];

  colNum = $(theInput).closest('tr').children().index($(theInput).closest('td'));
  //Look for identifier in the groups
  //If no groups, or not in a group, just use the current identifier
  var rowNum, colNum;
  var members = groupFromId(rootName);
  var nodes = members.split('|');
  var colEles = new Array();
  maxwidth = 0;

  for (nn = 0; nn < nodes.length; nn++) {
    rootName = nodes[nn];
    var items = rowVals[rootName].split(' ');
    var xx, eleWidth, ele;
    header = document.getElementById(rootName + '_hid0_' + y);
    if (header) {
      eleWidth = testHeaderWidth(header);
      maxwidth = (maxwidth < eleWidth ? eleWidth : maxwidth);
      eleWidth = 0;
    }
    for (xx = 0; xx < items.length; xx++) {
      rowNum = xx + 1;
      colEles[xx] = document.getElementById(rootName + '_id' + items[xx] + '_' + y);
      if (!colEles[xx]) colEles[xx] = $('#' + rootName + ' tr:eq(' + rowNum + ') td:eq(' + colNum + ')')[0];
      if (colEles[xx].options) {
        eleWidth = testSelectWidth(colEles[xx]);
      } else if (colEles[xx].nodeName == 'INPUT' || colEles[xx].nodeName == 'TEXTAREA') {
        eleWidth = testCellWidth(colEles[xx].value);
      } else {
        eleWidth = testCellWidth(colEles[xx].innerHTML);
      }
      maxwidth = (maxwidth < eleWidth ? eleWidth : maxwidth);
    }
    maxwidth = (theMax <= maxwidth ? theMax : maxwidth);
    maxwidth = (theMin >= maxwidth ? theMin : maxwidth);
  }
  for (nn = 0; nn < nodes.length; nn++) {
    rootName = nodes[nn];
    items = rowVals[rootName].split(' ');
    for (xx = 0; xx < items.length; xx++) {
      rowNum = xx + 1;
      thePad = 0;
      colEles[xx] = document.getElementById(rootName + '_id' + items[xx] + '_' + y);
      if (!colEles[xx]) {
        colEles[xx] = $('#' + rootName + ' tr:eq(' + rowNum + ') td:eq(' + colNum + ')')[0];
        var thePad = parseInt($(colEles[xx]).css('padding-left')) + parseInt($(colEles[xx]).css('padding-right'));
      }
      colEles[xx].style.width = (maxwidth - thePad) + 'px';
      if (!colEles[xx].options) colEles[xx].value = colEles[xx].value; //reset to fix alignment of text in input
    }

  }
}

function groupFromId(theTableId) {
  var nn, mm, groupArray;
  var foundGroup = theTableId;
  // Search the tableGroups for the ID provided.
  // Return the group if it exists.
  for (nn = 0; nn < tableGroups.length; nn++) {
    if (tableGroups[nn].split('|').indexOf(theTableId) >= 0) {
      groupArray = tableGroups[nn].split('|');
      // We need to ensure all tables in the group exist in the current form
      for (mm = groupArray.length - 1; mm >= 0; mm--) {
        if (!$('#' + groupArray[mm])[0]) groupArray.splice(mm, 1);
      }
      foundGroup = groupArray.join('|');
    }
  }
  return foundGroup;
}

// this routine will cache resize requests until called with an empty ('') param, then it will resize on-demand
function resizeTableCols(theTableId) {
  if (initialRender == 0) {
    // Not initial rendering; we are just resizing one table or group now
    renderTableGroup(groupFromId(theTableId));
  } else {
    // Initial rendering of the form or page
    if (theTableId.length > 0) {
      // Just cache the request to resize this table
      tablesToResize[theTableId] = 1;
    } else {
      // we are ready to render the entire form's set of tables
      for (var nn in tablesToResize) {
        // Loop through the resize requests
        // If the resize request is not yet flagged as done,
        // get the group and resize them.
        if (tablesToResize[nn] == 1) { renderTableGroup(groupFromId(nn));}
      } // End of loop. Go to next item in cache
      initialRender = 0;
    }
  }
  return true;
}

function renderTableGroup(theGroup) {
  if (theGroup.length == 0) return;
  var nodes = theGroup.split('|');
  var colEles = new Array();
  var x, y, nn, tmp;
  var header, maxwidth;
  var theMax, theMin, theValue;
  var eleWidth, ele, theCell;

  var theTable = new Array();
  var theCells = new Array();
  var rowCount = new Array();
  var rowOffset = new Array();
  var theHeaderCells = new Array();

  // Populate the cell and row arrays
  for (nn = 0; nn < nodes.length; nn++) {
    colEles[nn] = new Array();
    theTable[nn] = $('#' + nodes[nn])[0];
    theCells[nn] = theTable[nn].getElementsByTagName('TD');
    rowCount[nn] = theTable[nn].getElementsByTagName('TR').length;
    rowOffset[nn] = 1;
    //Clear out the resize flag for this table
    tablesToResize[nodes[nn]] = 0;

    if (theTable[nn].firstChild) {
	    if (theTable[nn].firstChild.firstChild) {
	      theHeaderCells[nn] = theTable[nn].firstChild.firstChild.getElementsByTagName('TH');
	      var colCount = theHeaderCells[nn].length;
	    }
	    if (colCount == 0 && theTable[nn].getElementsByTagName('TR').length > 0) {
	      colCount = theTable[nn].firstChild.firstChild.getElementsByTagName('TD').length;
	    }
  	}
  }

  theMax = MaxCol[nodes[0]];
  theMin = MinCol[nodes[0]];

  // If the tables are grouped, we need to resize the row headers across the group
  if (nodes.length > 1) {
    var maxhwidth = 0;
    var rowHeaders = new Array();
    // First test the row headers
    for (var mm = 0; mm < nodes.length; mm++) { // Loop through the tables
      rowHeaders[mm] = $('#' + nodes[mm] + ' tr td:first-child, tr th:first-child');
      $.each(rowHeaders[mm], function() {
        eleWidth = testHeaderWidth(this);
        maxhwidth = (maxhwidth < eleWidth ? eleWidth : maxhwidth);
        eleWidth = 0;
      });
    }

    // Now resize the row headers
    for (var mm = 0; mm < nodes.length; mm++) { // Loop through the tables
      $.each(rowHeaders[mm], function() {
        $(this).width(maxhwidth);
      });
    }
  }

  for (var xx = 1; xx < colCount; xx++) { // Loop through the columns
    maxwidth = 0;
    for (nn = 0; nn < nodes.length; nn++) { // Loop through the tables
      header = theHeaderCells[nn][xx];
      if (header) {
        eleWidth = testHeaderWidth(header);
        maxwidth = (maxwidth < eleWidth ? eleWidth : maxwidth);
        eleWidth = 0;
      } else rowOffset[nn] = 0;
      for (var yy = 0; yy < rowCount[nn] - rowOffset[nn]; yy++) {
        theCell = theCells[nn][xx + (colCount * yy)];
        if (theCell) {
          if (theCell.firstChild) {
            if (theCell.firstChild.options) {
              colEles[nn][yy] = theCell.firstChild;
              eleWidth = testSelectWidth(colEles[nn][yy]);
            } else if (theCell.firstChild.nodeName == 'INPUT' || theCell.firstChild.nodeName == 'TEXTAREA') {
              colEles[nn][yy] = theCell.firstChild;
              theValue = colEles[nn][yy].value;
              if (theValue.length < checkLimiter) eleWidth = theMin; else eleWidth = testCellWidth(theValue);
            } else {
              colEles[nn][yy] = theCell;
              theValue = colEles[nn][yy].innerHTML;
              if (theValue.length < checkLimiter) eleWidth = theMin; else eleWidth = testCellWidth(theValue);
            }
          } else {
            colEles[nn][yy] = theCell;
            theValue = colEles[nn][yy].innerHTML;
            if (theValue.length < checkLimiter) eleWidth = theMin; else eleWidth = testCellWidth(theValue);
          }
          maxwidth = (maxwidth < eleWidth ? eleWidth : maxwidth);
        }
      } // End loop for one column in one table
      maxwidth = (theMax <= maxwidth ? theMax : maxwidth);
      maxwidth = (theMin >= maxwidth ? theMin : maxwidth);
    } // End loop for one table

    for (nn = 0; nn < nodes.length; nn++) {
      for (yy = 0; yy < rowCount[nn] - rowOffset[nn]; yy++) {
        if (colEles[nn][yy]) {
          var tdPad = colEles[nn][yy].nodeName == 'TD' || colEles[nn][yy].nodeName == 'TH' ? parseInt($(colEles[nn][yy]).css('padding-left')) + parseInt($(colEles[nn][yy]).css('padding-right')) : 0;
          colEles[nn][yy].style.width = (maxwidth - tdPad) + 'px';
        }
      }
    }
  }
}

function getComputedWidth(theElt) {
  if (ieCompat) {
    tmphght = theElt.offsetWidth;
  }
  else {
    var tmphght1 = document.defaultView.getComputedStyle(theElt, '').getPropertyValue('width');
    tmphght = tmphght1.split('px');
    tmphght = tmphght[0];
  }
  return tmphght;
}


/*    debug code for this file only, normally found in tablesplicing_generic.js
// usage:
// timer.start("first test");
// var time = timer.end("first test);
 timer = {
  _map:{},
  start: function(msg){
   this._map[msg] = new Date().getTime();
  },
  end:   function(msg){
   this._map[msg] = new Date().getTime() - this._map[msg];
   return this._map[msg];
  },
  show: function(msg){
   console.log( "---------> " + msg + ": " + this._map[msg]);
  }
 };
*/


