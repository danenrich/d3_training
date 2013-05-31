// result_table.js
// Javascript routines to handle result table rendering
// $Id: //dev/EPS/js/result_table.js#28 $


function makeIOFURL(fieldObj, urlBase, varName, varIDPos, evalVar, evalCheck ) {
  // get projid and tempid from hidden form vars: projid, tempid
  var ProjID, TempID, baseURL, indexOrder, fullURL;
  var idxFixedList, idxPivotList, idxFixedVals, idxPivotVals;
  ProjID = $('#projid').attr('value');
  TempID = $('#tempid').attr('value');
  baseURL = '';
  indexOrder = '';
  fullURL = '';
  idxFixedList = new Array;
  idxPivotList = new Array;
  if (urlBase.length > 0) {
    // use varName to get index values
    // check for fixed indexes (variableName_indexName_orig) [e.g.:Qa_mi_3d_table_out_QA_MI_INDEX_6_orig]   (cheater jquery: idx_fixed)
    // check for RI and CI  (variableName_ri_orig,variableName_ci_orig)  [e.g.: Qa_mi_3d_table_out_ri_orig]  (cheater jquery: idx_pivot)
    $('input:hidden').each(function() {
      if ($(this).attr('idx_fixed') && $(this).attr('name') == varName + '_' + $(this).attr('idx_fixed') + '_orig') {
        idxFixedList[$(this).attr('idx_pos')] = $(this).attr('idx_fixed') + '|fx|' + $(this).attr('value');
      }
      if ($(this).attr('idx_pivot') && $(this).attr('name') == varName + '_ri_orig') {
        idxPivotList[1] = $(this).attr('idx_pivot') + '|ri|1';
      }
      if ($(this).attr('idx_pivot') && $(this).attr('name') == varName + '_ci_orig') {
        idxPivotList[2] = $(this).attr('idx_pivot') + '|ci|2';
      }
    });
    indexOrder = idxFixedList.join(',') + ',' + idxPivotList.join(',');

    // build up base URL
    baseURL = urlBase + '&modelid=' + ProjID + '&tempid=' + TempID;

    // add all tags to querystring
    fullURL = baseURL + '&iof_var=' + varName + '&iof_idpos=' + varIDPos + '&iof_idx=' + indexOrder;
    if (evalVar.length > 0) {
      fullURL += '&evaluate=' + evalVar;
    }
    if (evalCheck.length > 0) {
      fullURL += '&checkvar=' + evalCheck;
    }
  }
  // set new URL to href in fieldObj
  fieldObj.href = fullURL;
  return true;
}


function pivch(field, ident) {

  document.form1['pivotchange'].value = field.name;
  document.form1['pivch_' + ident].value = field.name;

  if (document.form1['view_' + ident] && document.form1['view_' + ident].value == 'chart') {
    document.form1['act'].value = 'Chart';
  }
  if (PreSubmit()) {
    document.form1.submit();
  }
  if (document.form1['view_' + ident] && document.form1['view_' + ident].value == 'chart') {
    document.form1['act'].value = '';
  }
}

function fixedch(field, ident) {

  document.form1['fixedchange'].value = field.name;
  document.form1['fixedch_' + ident].value = field.name;

  if (PreSubmit()) {
    document.form1.submit();
  }
}

function fch(field, validateflag, ident) {
  if (typeof ident == 'object') { ident = ident.value; }
  if (newFieldChange(ident, field)) {
    var s = (document.form1['fieldchanges_' + ident].value != '') ? ',' : '';
    document.form1['fieldchanges_' + ident].value += s + field.name;
  }
  if (validateflag && CopyPastON == false) {
    if (field) {
      var valid = eval('validatefld_' + ident + "('" + field.id + "')");
      if (!valid) {
        field.value = origVals[field.name];
        resizeCol(field);
      } else {
        if (emptyIsZero && IsNumericValidation && field.value.length == 0) {
          field.value = '0';
        }
        valueChanged(ident);
      }
    }
  } else {
    valueChanged(ident);
  }
}

function newFieldChange(ident, field) { // only add element to fieldchanges if it is not already there
  var fieldArray = new Array();
  fieldArray = document.form1['fieldchanges_' + ident].value.split(',');
  if ($.inArray(field.name, fieldArray) == -1) {return true;} else {return false;}
}

function popch(field, choice, sel) {
  var fld = document.form1[field];
  for (var i = 1; i < choice.length; i++) {
    fld.options[i - 1] = new Option(html_entity_decode(choice[i]));
    if (choice[i].replace(/\s{1,}/, ' ') == sel.replace(/\s{1,}/, ' ')) {
      fld.options[i - 1].selected = true;
    }
  }
}

var entityHash = new Array();

function html_entity_decode(str) {
  if (entityHash[str]) {
    // get cached value
    return entityHash[str];
  } else {
    var ta = document.createElement('textarea');
    ta.innerHTML = str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    entityHash[str] = ta.value;
    return ta.value;
  }
}

function pausecomp(millis) 
{
  date = new Date();
  var curDate = null;
  do { var curDate = new Date(); }
  while (curDate - date < millis);
}

function BreakItUp(field)
{
  //Set the limit for field size.
  var FormLimit = 102399;

  //Get the value of the large input object.
  var TempVar = new String;
  TempVar = field.value;

  //If the length of the object is greater than the limit, break it
  //into multiple objects.
  if (TempVar.length > FormLimit)
  {
    field.value = TempVar.substr(0, FormLimit);
    TempVar = TempVar.substr(FormLimit);

    while (TempVar.length > 0)
    {
      var objTEXTAREA = document.createElement('TEXTAREA');
      objTEXTAREA.name = field.name;
      objTEXTAREA.value = TempVar.substr(0, FormLimit);
      document.form1.appendChild(objTEXTAREA);

      TempVar = TempVar.substr(FormLimit);
    }
  }
}


function fixChartHeight() {

  var aspRatio = chartWidth / chartHeight;
  var PosY = findPosY(document.getElementById('graphTD'));

  document.getElementById('graphTD').height = (document.body.offsetWidth - 48) / aspRatio;
}

function findPosY(obj)
{
  var curtop = 0;
  if (document.getElementById || document.all)
  {
    while (obj.offsetParent)
    {
      curtop += obj.offsetTop;
      obj = obj.offsetParent;
    }
  }
  else if (document.layers)
    curtop += obj.y;
  return curtop;
}


function SubmitFormUpdate(s,v) {
  document.form1['act'].value = s;
  document.form1['sview'].value = v;
  document.form1.submit();
}

// this function need to call from setTimeout() function for it to work properly (delay time)
function SubmitFormPreviewGraph(graphaction, sview) {
  var wName = graphaction;
  prevWin = window.open('', wName, 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,copyhistory=no,width=650,height=550');
  document.form1.target = wName;
  document.form1.act.value = sview;
  document.form1.submit();
  document.form1.target = '_self';
  document.form1.act.value = 'preview';


  if (prevWin != null) {
    prevWin.focus(); //this call was/is breaking JS, need to check for null before calling a method
  }

}

// Graph Configuration functions
function configureGraph(ispublic, projname, varname, varlabel, view, ri, pwin ) {
  var graphURL, urlpara;
  if (typeof ri == 'object' || ri == null) {
    urlpara = '?publicgraph=' + ispublic + '&varname=' + varname + '&varlabel=' + varlabel + '&view=' + view;
  } else {
    urlpara = '?publicgraph=' + ispublic + '&varname=' + varname + '&varlabel=' + varlabel + '&view=' + view + '&ri=' + ri;
  }
  graphURL = 'GraphMain.aspx' + urlpara;
  openGraphDialog(graphURL, 700, 550, retGraphFunc, '');

}

function retGraphFunc() {
  var sview, graphaction, prevWin, varName;
  graphaction = document.form1['graphaction'].value;
  varName = 'view_' + document.form1['sourcevar'].value;
  sview = document.form1[varName].value;
  var functRef;

  if (graphaction == 'preview' || graphaction == 'prevdef')
  {
    functRef = "SubmitFormPreviewGraph('" + graphaction + "','" + sview + "')";
  }
  else
  {
    functRef = "SubmitFormUpdate('UpdateChart','" + sview + "')";
  }
  //alert (functRef);
  setTimeout(functRef, 500); // delay 1/2 second
  return prevWin;
}

var Navig4 = ((navigator.appName == 'Netscape') && (parseInt(navigator.appVersion) == 4));

function openGraphDialog(url, width, height, returnFunc, args) {

  if (!dialogWin.win || (dialogWin.win && dialogWin.win.closed)) {
    // Initialize properties of the modal dialog object.
    dialogWin.returnFunc = returnFunc;
    dialogWin.returnedValue = '';
    dialogWin.args = args;
    dialogWin.url = url;
    dialogWin.width = width;
    dialogWin.height = height;
    // Keep name unique so Navigator doesn't overwrite an existing dialog.
    // RSS removed name because it caused a delay in window.open
    dialogWin.name = ''; // (new Date()).getSeconds().toString()
    // Assemble window attributes and try to center the dialog.
    if (Navig4) {
      // Center on the main window.
      dialogWin.left = window.screenX +
          ((window.outerWidth - dialogWin.width) / 2);
      dialogWin.top = window.screenY +
          ((window.outerHeight - dialogWin.height) / 2);
      var attr = 'screenX=' + dialogWin.left +
          ',screenY=' + dialogWin.top + ',resizable=yes,scrollbars=yes,width=' +
          dialogWin.width + ',height=' + dialogWin.height;
    } else {
      // The best we can do is center in screen.
      dialogWin.left = (screen.width - dialogWin.width) / 2;
      dialogWin.top = (screen.height - dialogWin.height) / 2;
      var attr = 'left=' + dialogWin.left + ',top=' +
          dialogWin.top + ',resizable=yes,scrollbars=yes,width=' + dialogWin.width +
          ',height=' + dialogWin.height;
    }

    // Generate the dialog and make sure it has focus.
    dialogWin.win = window.open(dialogWin.url, dialogWin.name, attr);
  //dialogWin.win.focus()
  } else {
    dialogWin.win.focus();
  }
}
