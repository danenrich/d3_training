/**
MB_TableSorter class. Author: Manos Batsis, mailto:xcircuit@yahoo.com
main methods:
 sortOn(column to base the sort, button/header matching the column)
 setSortFuncs(array of inegers. used to set the sort function for each column:
0 for default, 1 for case-insensitive, 2 for date (US), 3 for date (european))
 autoCalled: readTable(table object) reads a table
 updateTblCellsTxt(table object) updates the contents of the table
10-29-03 RSS: Fix to date sorting to allow for a href wrapping around date.
              Fix to case insensitive sorting to handle blanks
*/
function MB_TableSorter(arr, skipRowOne)
{
  if (skipRowOne && skipRowOne == 1)
    this.skipRowOne = 1;
  else
    this.skipRowOne = 0;

  if (arr instanceof Array)
    this.matrix = arr;
  else
    this.matrix = this.readTable(arr);
  this.oDataElem = document.createElement('tbody');
  this.lastColIndex = -1;
  this.currentColIndex = -1;
  this.arrSortFuncs = new Array();
  this.arrowDirection = null;
}

MB_TableSorter.prototype.sortOn = function(iColIndex, clickedElem)
    {
  this.currentColIndex = iColIndex;
  var temp = new Array(this.matrix.length);
  for (var i = 0; i < temp.length; i++)
    temp[i] = this.matrix[i][iColIndex] + '_mbns_' + i;
  if (this.lastColIndex == iColIndex)
  {
    this.arrowDirection = !(this.arrowDirection);
    temp.reverse();
  }
  else
  {
    this.arrowDirection = true;
    var iFunc = this.arrSortFuncs[iColIndex];
    if (iFunc == 0) temp.sort();
    else if (iFunc == 1)temp.sort(this.noCaseFunc);
    else if (iFunc == 2)temp.sort(this.dateFunc);
    else if (iFunc == 3)temp.sort(this.dateEUFunc);
    else if (iFunc == 4)temp.sort(this.numFunc);
  }
  this.fixArrows(clickedElem);
  var tempMatrix = new Array(this.matrix.length);
  for (var j = 0; j < tempMatrix.length; j++)
  {
    var iRow = temp[j].substring(temp[j].indexOf('_mbns_') + 6, temp[j].length);
    tempMatrix[j] = new Array();
    for (var k = 0; k < this.matrix[j].length; k++)
      tempMatrix[j][k] = this.matrix[iRow][k];
  }
  this.matrix = tempMatrix;
  this.lastColIndex = iColIndex;
};
MB_TableSorter.prototype.setSortFuncs = function(arr)
    {
  for (var i = 0; i < arr.length; i++)
    this.arrSortFuncs[i] = arr[i];
};
MB_TableSorter.prototype.numFunc = function(a, b)
    {
  var intA = parseInt(a.substring(0, a.indexOf('_mbns_'))),
      intB = parseInt(b.substring(0, b.indexOf('_mbns_')));
  if (a.lastIndexOf('_mbns_') == 0) return 1;
  else if (b.lastIndexOf('_mbns_') == 0) return -1;
  else if (intA < intB) return -1;
  else if (intA > intB) return 1;

  else return 0;
};
MB_TableSorter.prototype.noCaseFunc = function(a, b)
    {
  var strA = a.toLowerCase(),
      strB = b.toLowerCase();
  if (a.lastIndexOf('_mbns_') == 0) return 1;
  else if (b.lastIndexOf('_mbns_') == 0) return -1;
  else if (strA < strB) return -1;
  else if (strA > strB) return 1;

  else return 0;
};
MB_TableSorter.prototype.dateFunc = function(a, b)
    {
  var intA = 0, intA2 = a.lastIndexOf('_mbns_');
  var intB = 0, intB2 = b.lastIndexOf('_mbns_');
  if (a.substring(0, 1) == '<')
  {
    intA = a.indexOf('>') + 1;
    intA2 = a.lastIndexOf('<');
    if (intA == intA2) return 1;
  }
  if (b.substring(0, 1) == '<')
  {
    intB = b.indexOf('>') + 1;
    intB2 = b.lastIndexOf('<');
    if (intB == intB2) return -1;
  }
  // To work with Netscape, we'll need to import a different date format
  // from the database; the format "Jul 2 2003 1:35PM" doesn't parse
  // to a Date object in Netscape.
  // RSS 12-31-03
  var datA = new Date(a.substring(intA, intA2)),
      datB = new Date(b.substring(intB, intB2));
  if (datA < datB) return 1;
  else if (datA > datB) return -1;
  else if (intA2 == 0) return 1;
  else if (intB2 == 0) return -1;
  else return 0;
};
MB_TableSorter.prototype.dateEUFunc = function(a, b)
    {
  var strA = a.substring(0, a.lastIndexOf('_mbns_')).split('/'),
      strB = b.substring(0, b.lastIndexOf('_mbns_')).split('/'),
      datA = new Date(strA[2], strA[1], strA[0]),
      datB = new Date(strB[2], strB[1], strB[0]);
  if (datA < datB) return -1;
  else if (datA > datB) return 1;
  else return 0;
};
MB_TableSorter.prototype.readTable = function(oElem)
    {
  if (oElem.nodeName != 'tbody')
    oElem = oElem.getElementsByTagName('tbody')[0];
  if (!oElem)
    return;
  var iRows = oElem.getElementsByTagName('tr');
  var arrX = new Array();
  for (var i = 0; i + this.skipRowOne < iRows.length; i++)
  {
    arrX[i] = new Array();
    var iCols = iRows[i + this.skipRowOne].getElementsByTagName('td');
    for (var j = 0; j < iCols.length; j++)
      arrX[i][j] = iCols[j].innerHTML;
  }
  return arrX;
};
MB_TableSorter.prototype.updateTblCellsTxt = function(oElem)
    {
  if (oElem.nodeName != 'tbody')
    oElem = oElem.getElementsByTagName('tbody')[0];
  if (!oElem)
    return;
  var iRows = oElem.getElementsByTagName('tr');
  for (var i = 0; i + this.skipRowOne < iRows.length; i++)
  {
    var iCols = iRows[i + this.skipRowOne].getElementsByTagName('td');
    for (var j = 0; j < iCols.length; j++)
      iCols[j].innerHTML = this.matrix[i][j];
  }
};
MB_TableSorter.prototype.toTbody = function()
    {
  for (i = 0; i < this.matrix.length; i++)
  {
    var tTr = document.createElement('tr');

    tTr.setAttribute('title', this.matrix[i][0]);
    for (var j = 0; j < this.matrix[0].length; j++)
    {
      var tTd = document.createElement('td');
      tTd.style.width = '30%';
      var tTxt = document.createTextNode(this.matrix[i][j]);
      tTd.appendChild(tTxt);
      tTr.appendChild(tTd);
    }
    this.oDataElem.appendChild(tTr);
    document.getElementsByTagName('textarea')[0].value = this.oDataElem.innerHTML;
  }
};
MB_TableSorter.prototype.appendTo = function(containerId, replacableId)
    {
  var exElem = document.getElementById(replacableId);
  var sId = exElem.getAttribute('id');
  exElem.removeAttribute('id');
  this.oDataElem.setAttribute('id', sId);
  document.getElementById(containerId).replaceChild(this.oDataElem, exElem);
  this.oDataElem = document.createElement('tbody');
};
MB_TableSorter.prototype.fixArrows = function(oElem)
    {
  if (oElem)
  {
    if (this.lastColIndex != (-1))
      oElem.parentNode.getElementsByTagName(oElem.nodeName)[this.lastColIndex].getElementsByTagName('img')[0].src = 'images/blank.gif';
    oElem.getElementsByTagName('img')[0].src = 'images/smalllightarrow' + this.arrowDirection + '.gif';
  }
};
