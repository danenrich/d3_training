
// multiinput.js
// Javascript routines used in MultiInput.XSL
// $Id: //dev/EPS/js/multiinput.js#1 $

// used in Multi-input
function ZoomToWindow(page, queryStr, act, sview) {
  var urlink = page + '?' + queryStr;

  if (Trim(sview).length > 0)
    urlink = urlink + '&sview=' + sview + '&view=' + sview;
  switch (act) {
    case 'LargeChart':
      wSize = 'width=850,height=650';
      if (Trim(act).length > 0)
        urlink = urlink + '&act=' + act;
      break;
    case 'Chart':
      wSize = 'width=650,height=550';
      break;
    default:
      wSize = 'width=650,height=550';
      if (Trim(act).length > 0)
        urlink = urlink + '&act=' + act;
      break;
  }

  var d = new Date();
  var wName = d.getUTCSeconds() + '_' + d.getUTCMinutes() + '_';   //Create a unique name for the window
  var wSize;

  window.open(urlink, wName, 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,copyhistory=no,' + wSize);
}

function mi_ZoomToWindow(zpage, vname, zlink_id, qStr, ztype, sview) {
  // mi_ZoomToWindow used JQuery language to update href of the link object
  $(document).ready(function() {
    var qFixed = '';
    var ampersand = '%26';
    $('input.' + vname + '_fixedval').each(function(n) {
      qFixed = qFixed + ampersand + this.name + '=' + this.value;
    });

    var zlinkObj = $('#' + zlink_id);
    if (zlinkObj) {

      var ri_name, ci_name;
      if ($('#' + vname + '_ri_orig')) {
        ri_name = $('#' + vname + '_ri_orig').attr('value');
        qStr = qStr + ampersand + 'ri_name=' + ri_name;
      }

      if ($('#' + vname + '_ci_orig')) {
        ci_name = $('#' + vname + '_ci_orig').attr('value');
        qStr = qStr + ampersand + 'ci_name=' + ci_name;
      }

      qStr = qStr + qFixed;
      var hrefJS = 'javascript:ZoomToWindow(' + "'" + zpage + "','" + qStr + "','" + ztype + "','" + sview + "')";

      // update href with modified query string
      zlinkObj.attr('href', hrefJS);
    }
  });
}








function validate_Formula(rawinput_id) {

  rawinput_id = 'valueField_' + rawinput_id;
  var rawinputObj = document.getElementById(rawinput_id);

  if (rawinputObj) {
    var formulaStr = rawinputObj.value;
    AJAX_ValidateFormula(formulaStr);
  }
  else
    alert('Invalid raw input element id : ' + rawinput_id);
}

function setNoConfirmOnExit() {
  // this flag will turn off the warning message on unload the input frame
  g_ConfirmExit = false;
}

var rawinputIDs = '';
function addrawinputID(vf_rawId) {
  if (rawinputIDs.indexOf(vf_rawId) == -1) {
    rawinputIDs = rawinputIDs + vf_rawId;
  }
}

function Onclick_OperatorButton(this_btn, rawinput_id) {
  rawinput_id = 'valueField_' + rawinput_id;

  if (rawinputIDs.indexOf(rawinput_id) != -1) {
    var Operator = this_btn.operator;
    if (!Operator)
      Operator = this_btn.getAttribute('operator');

    var rawinputObj = document.getElementById(rawinput_id);
    if (rawinputObj)
      insertAtCursor(rawinputObj, Operator);
    else
      alert('Invalid  raw input id: ' + rawinput_id);
  }
  else
    alert('Position the cursor on the formular input');
}

function Onclick_IdButton(this_btn, rawinput_id) {

  rawinput_id = 'valueField_' + rawinput_id;
  if (rawinputIDs.indexOf(rawinput_id) != -1) {
    var nodeId = this_btn.node_id;
    if (!nodeId)
      nodeId = this_btn.getAttribute('node_id');

    var rawinputObj = document.getElementById(rawinput_id);
    if (rawinputObj)
      insertAtCursor(rawinputObj, nodeId);
    else
      alert('Invalid raw input id: ' + rawinput_id);
  }
  else
    alert('Position the cursor on the formular input');
}

function insertAtCursor(elementRef, valueToInsert)
{
  if (document.selection) {
    // Internet Explorer...
    elementRef.focus();
    var selectionRange = document.selection.createRange();
    selectionRange.text = valueToInsert;
    // Save the new value in elementRef
    var newValue = elementRef.value;
    document.selection.empty(); // Clear the selection

    elementRef.value = newValue;
  }
  else if ((elementRef.selectionStart) || (elementRef.selectionStart == '0'))
  { // Mozilla/Netscape...
    var startPos = elementRef.selectionStart;
    var endPos = elementRef.selectionEnd;
    elementRef.value = elementRef.value.substring(0, startPos) +
        valueToInsert + elementRef.value.substring(endPos, elementRef.value.length);
  }
  else
  {
    elementRef.value += valueToInsert;
  }

  var theField = document.getElementById('form1').variablechanged;
  var ident = elementRef.id.substring(11, elementRef.id.length);

  if (theField.value == '')
    theField.value = ',' + ident + ',';
  else if (theField.value.indexOf(',' + ident + ',') == -1)
    theField.value = theField.value + ident + ',';

}

function onload_flash_init() {
  var e = document.getElementsByName('graphTD');
  for (var i = 0; isLSS(i, e.length); i++) {e[i].style.visibility = 'visible';}
}




function ResizeInputArea(newsize) {
  if (document.getElementById('inputSize').checked == true)
    document.getElementById('valueField').rows = newsize;
  else
    document.getElementById('valueField').rows = 4;

}


function CallSetRichText() {
  try {
    setTimeout('setRichText()', 15);
  } catch (err) {
    alert('Control Failed to Obtain Rich Text on First Attempt! \n press OK to Try again \n  Please Report this Error.');
    setTimeout('setRichText()', 1000);
  }
}
// set the rich text data from the form into the Control
function setRichText() {
  richTextOpen = false;
  if (typeof window.frames['richtext'] == 'object') {
    window.frames['richtext'].setXHTML(document.form1.valueField.value);
    document.form1.valueField.value = window.frames['richtext'].getXHTML();
    richTextOpen = true;
    window.frames['richtext'].setCallBack(valueChanged);
    window.frames['richtext'].CallBackOnce();
  }
}
// get the rich text data from the Control and put into form
function getRichText() {
  if (richTextOpen) {
    if (typeof window.frames['richtext'] == 'object') {
      document.form1.valueField.value = window.frames['richtext'].getXHTML();
    }
  }
}
// resize control - partially working in FireFox.
var scSize = 0;
function ResizeRichTextArea() {
  var bH = 0, bW = 0, h = 0, w = 0, docOn = false;
  var gridsizemul;
  gridsizemul = getDeviceDPI() / 96;

  if (document.getElementById('sc1').className == 'layshow') {
    docOn = true;
    scSize = getHeight('sc1');
  } else {
    docOn = false;
  }
  bH = get_win_h() - (4 + (18 * gridsizemul)) - getHeight('desc_table') - getHeight('sc1') - 25;
  bW = get_win_w() - (18 * gridsizemul) + 5;

  if (typeof window.frames['richtext'] == 'object') {
    h = window.frames['richtext'].getHEIGHT(bH);
    w = window.frames['richtext'].getWIDTH(bW);
    if (window.frames['richtext'].hScroll()) {
      h = h - 5 - (18 * gridsizemul);
    }
    if (window.frames['richtext'].vScroll(docOn, getHeight('dock_top'))) {
      w = w - 15 - (18 * gridsizemul);
    }
  } else {
    h = 300;
    w = 600;
    alert('No RichText Object Found!');
  }
  document.getElementById('richtext').style.height = h;
  document.getElementById('richtext').style.width = w;
}

function fireOnChange(changeObj) {
  changeObj.onchange();
  changeObj.style.visibility = 'hidden';
}


function submit_me(warnvar) {
  if (confirm(warnvar)) {
    if (PreSubmit()) {
      g_ConfirmExit = false;
      document.form1.submit();
    }
    return true;
  } else {
    return false;
  }
}


