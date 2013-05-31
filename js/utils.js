// utils.js
// Javascript utility routines
// $Id: //dev/EPS/js/utils.js#52 $

onerror = errorHandler;
var last_error_message = '';

function errorHandler(eMsg, eUrl, eLine) {
  last_error_message = last_error_message + '|' + eMsg;
}
function getLastErrorMessage() {
  var lastError = last_error_message;
  last_error_message = '';
  return lastError;
}

function attDisplay(oElm) {
  var anyMatch = 0;
  for (var i = oElm.length - 1; i >= 0; i--) {
    var elem = oElm[i];
    if (elem.id == 'tempBlock') {
      var tempVal = elem.getAttribute('templates');
      var boxes = getElementsByClassName(document, 'input', 'cbox');
      var match = 0;
      for (var j = boxes.length - 1; j >= 0; j--) {
        var elemBox = boxes[j];
        if (elemBox.checked == true && tempVal.match('_' + elemBox.value + '_') != null) {
          match = 1;
          anyMatch = 1;
        }
      }
      if (match == 0) {
        elem.style.display = 'none';
      } else {
        elem.style.display = 'inline';
      }
    }
  }
  if (anyMatch == 0) {
    document.getElementById('tempContainer').style.display = 'none';
  } else {
    document.getElementById('tempContainer').style.display = 'inline';
  }
}

function getElementsByClassName(oElm, strTagName, strClassName) {
  var arrElements = (strTagName == '*' && oElm.all) ? oElm.all : oElm.getElementsByTagName(strTagName);
  var arrReturnElements = new Array();
  strClassName = strClassName.replace(/\-/g, '\\-');
  var oRegExp = new RegExp('(^|\\s)' + strClassName + '(\\s|$)');
  var oElement;
  for (var i = 0; i < arrElements.length; i++) {
    oElement = arrElements[i];
    if (oRegExp.test(oElement.className)) {
      arrReturnElements.push(oElement);
    }
  }
  return (arrReturnElements);
}

function setPulldowns(string) {
  var regString = new RegExp(string, 'i');
  var inputs = document.form1.getElementsByTagName('SELECT');
  //able to do multiple selection box
  for (i = 0; i < inputs.length; i++)
  { //looping thru all SELECT elements
    if (inputs[i].getAttribute('SS_colKey') == null) //attribute not found
      continue; //we assume that this input field is not for us
    var opts = inputs[i].options;
    var match = 0;
    for (intLoop = 0; intLoop < opts.length; intLoop++)
    { //looping thru all OPTIONS elements
      if (opts[intLoop].text.search(regString) != -1) {
        opts[intLoop].selected = true;
        match = 1;
      }
    }
    if (match == 0 || string.length == 0)
      opts[0].selected = true;
  }
}

function docwin(s)
{
  var path = 'doc/';
  if (s != '') { path += s; }
  openwin(path, 'docwin', 900, 500);
}

function openwin(s, wname, w, h)
{
  myWindow = window.open(s, wname,
      'directories=no,menubar=yes,status=yes,scrollbars=yes,resizable=yes,location=no,toolbar=no,width='
                + w + ',height=' + h);
  myWindow.focus();
}

function zoom() {
  if (top != this)
    window.open(location.href, 'Zoom',
        'directories=no,menubar=yes,scrollbars=yes,resizable=yes,location=no,toolbar=no');
  else
    window.close();
}

// Currently unused, but should be invoked to update opener
function refreshOpener() {
  window.opener.reload();
}

function replaceXMLChars(entry) {
  temp = '' + entry; // temporary holder

  temp = replaceChars(temp, '&amp;', '&');
  temp = replaceChars(temp, '&gt;', '>');
  temp = replaceChars(temp, '&lt;', '<');
  temp = replaceChars(temp, '&apos;', "\'");
  temp = replaceChars(temp, '&quot;', '\"');
  temp = replaceChars(temp, '**br**', '\n\r');

  return temp;
}

function replaceChars(entry, out, add) {
  temp = '' + entry; // temporary holder

  while (temp.indexOf(out) > -1) {
    pos = temp.indexOf(out);
    temp = '' + (temp.substring(0, pos) + add +
        temp.substring((pos + out.length), temp.length));
  }
  return temp;
}

function imgswap(aa) {
  aa = document.getElementById(aa);
  aa.src = (aa.src.indexOf('coll') > 0) ? 'images/UI_om_expand.gif' : 'images/UI_om_collapse.gif';
}

function showhide(aa) {
  var aaName = aa;
  aa = document.getElementById(aa);
  aa.className = (aa.className == 'layshow') ? 'layhide' : 'layshow';
  setSubCookie('dock', aaName, aa.className);
}

function showdock(aa) {
  var aaName = aa;
  aa = document.getElementById(aa);
  aa.className = 'layshow';
  setSubCookie('dock', aaName, aa.className);
}

function hidedock(aa) {
  var aaName = aa;
  aa = document.getElementById(aa);
  aa.className = 'layhide';
  setSubCookie('dock', aaName, aa.className);
}

function createCookie(name,value,days)
{
  if (days)
  {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    var expires = '; expires=' + date.toGMTString();
  }
  else var expires = '';
  document.cookie = name + '=' + value + expires + '; path=/';
}

function readCookie(name)
{
  var nameEQ = name + '=';
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++)
  {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function setSubCookie(uName, name, value )
{
  uValue = readCookie(uName);
  if (uValue) {
    // ':' is delimiter for sub cookie
    uCookies = uValue.split(':');
    var found = -1; // flags whether sub-cookie for the name is present
    for (c = 0; c < uCookies.length; c++)
    {
      // '?' is identifier between name and value for sub cookie.
      t = uCookies[c].split('?');
      tName = t[0];
      tValue = t[1];
      if (tName == name) {
        found = 1;
        tValue = value;
        t[1] = tValue;
        uCookies[c] = t.join('?');
      }
    }
    if (found == -1)
      uCookies[uCookies.length] = name + '?' + value;
    uValue = uCookies.join(':');
  } else {
    uValue = name + '?' + value;
  }
  // update real cookie
  createCookie(uName, uValue, 100);
}

function getSubCookie(uName, name )
{
  uValue = readCookie(uName);
  if (uValue) {
    var flag = uValue.indexOf(name + '?');
    var colon = 0;
    if (flag != 0) {
      flag = uValue.indexOf(':' + name + '?');
      colon = 1;
    }
    if (flag != -1) {
      flag += name.length + 1 + colon;
      end = uValue.indexOf(':', flag);
      if (end == -1) end = uValue.length;
      return uValue.substring(flag, end);
    }
  }
}


//**********************************************************************
//  BEGIN MODAL DIALOG CODE (can also be loaded as external .js file)
//***********************************************************************/
// Global for brower version branching.
var Nav4 = ((navigator.appName == 'Netscape') && (parseInt(navigator.appVersion) >= 4));

// One object tracks the current modal dialog opened from this window.
var dialogWin = new Object();

// Generate a modal dialog.
// Parameters:
//    url -- URL of the page/frameset to be loaded into dialog
//    width -- pixel width of the dialog window
//    height -- pixel height of the dialog window
//    returnFunc -- reference to the function (on this page)
//                  that is to act on the data returned from the dialog
//    args -- [optional] any data you need to pass to the dialog
function openDGDialog(url, width, height, returnFunc, args) {
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
    if (Nav4) {
      // Center on the main window.
      dialogWin.left = window.screenX +
          ((window.outerWidth - dialogWin.width) / 2);
      dialogWin.top = window.screenY +
          ((window.outerHeight - dialogWin.height) / 2);
      var attr = 'screenX=' + dialogWin.left +
          ',screenY=' + dialogWin.top + ',resizable=no,scrollbars=yes,width=' +
          dialogWin.width + ',height=' + dialogWin.height;
    } else {
      // The best we can do is center in screen.
      dialogWin.left = (screen.width - dialogWin.width) / 2;
      dialogWin.top = (screen.height - dialogWin.height) / 2;
      var attr = 'left=' + dialogWin.left + ',top=' +
          dialogWin.top + ',resizable=no,scrollbars=yes,width=' + dialogWin.width +
          ',height=' + dialogWin.height;
    }

    // Generate the dialog and make sure it has focus.
    dialogWin.win = window.open(dialogWin.url, dialogWin.name, attr);
    if (dialogWin.win != null) {
      dialogWin.win.focus();
    }
  } else {
    dialogWin.win.focus();
  }
}

// Event handler to inhibit Navigator form element
// and IE link activity when dialog window is active.
function deadend() {
  if (dialogWin.win && !dialogWin.win.closed) {
    dialogWin.win.focus();
    return false;
  }
}

// Since links in IE4 cannot be disabled, preserve
// IE link onclick event handlers while they're "disabled."
// Restore when re-enabling the main window.
var IELinkClicks;

// Disable form elements and links in all frames for IE.
function disableForms() {
  IELinkClicks = new Array();
  for (var h = 0; h < frames.length; h++) {
    try {
      for (var i = 0; i < frames[h].document.forms.length; i++) {
        for (var j = 0; j < frames[h].document.forms[i].elements.length; j++) {
          frames[h].document.forms[i].elements[j].disabled = true;
        }
      }
    } catch (err) {

    }
    IELinkClicks[h] = new Array();
    try {
      for (i = 0; i < frames[h].document.links.length; i++) {
        IELinkClicks[h][i] = frames[h].document.links[i].onclick;
        frames[h].document.links[i].onclick = deadend;
      }
      frames[h].window.onfocus = checkModal;
      frames[h].document.onclick = checkModal;
    } catch (err) {
    }
  }
}

// Restore IE form elements and links to normal behavior.
function enableForms() {
  for (var h = 0; h < frames.length; h++) {
    try {
      for (var i = 0; i < frames[h].document.forms.length; i++) {
        for (var j = 0; j < frames[h].document.forms[i].elements.length; j++) {
          frames[h].document.forms[i].elements[j].disabled = false;
        }
      }
    } catch (err) {
    }
    try {
      for (i = 0; i < frames[h].document.links.length; i++) {
        frames[h].document.links[i].onclick = IELinkClicks[h][i];
      }
    } catch (err) {
    }
  }
}

// Grab all Navigator events that might get through to form
// elements while dialog is open. For IE, disable form elements.
function blockEvents() {
  if (Nav4) {
    for (var h = 0; h < parent.frames.length; h++) {
      parent.frames[h].window.captureEvents(Event.CLICK | Event.MOUSEDOWN | Event.MOUSEUP | Event.FOCUS);
      parent.frames[h].window.onclick = deadend;
    }
  } else {
    disableForms();
  }
  window.onfocus = checkModal;
}
// As dialog closes, restore the main window's original
// event mechanisms.
function unblockEvents() {
  if (Nav4) {
    for (var h = 0; h < parent.frames.length; h++) {
      parent.frames[h].window.releaseEvents(Event.CLICK | Event.MOUSEDOWN | Event.MOUSEUP | Event.FOCUS);
      parent.frames[h].window.onclick = null;
      parent.frames[h].window.onfocus = null;
    }
  } else {
    enableForms();
  }
}

// Invoked by onFocus event handler of EVERY frame,
// return focus to dialog window if it's open.
function checkModal() {
  setTimeout('finishChecking()', 50);
  return true;
}

function finishChecking() {
  if (dialogWin.win && !dialogWin.win.closed) {
    dialogWin.win.focus();
  }
}
//**************************
//  END MODAL DIALOG CODE
//**************************/


//On scrolling of DIV tag.
function OnDivScroll(selectId,  objSize)
{
  var selectObj = document.getElementById(selectId);
  //The following archives two things while scrolling
  //a) On horizontal scrolling: To avoid vertical scroll bar in select box when the size of
  //  the selectbox is 8 and the count of items in selectbox is greater than 8.
  //b) On vertical scrolling: To view all the items in selectbox

  //Check if items in selectbox is greater than 10, if so then making the size of the selectbox to count of
  //items in selectbox,so that vertival scrollbar won't appear in selectbox
  if (selectObj.options.length > 10)
  {
    selectObj.size = selectObj.options.length;
  }
  else
  {
    if (objSize != null)
      selectObj.size = objSize;
    else
      selectObj.size = 10;
  }
}

//On focus of Selectbox
function OnSelectFocus(selectObj, divId)
{

  //On focus of Selectbox, making scroll position of DIV to very left i.e 0 if it is not. The reason behind
  //is, in this scenario we are fixing the size of Selectbox to 8 and if the size of items in Selecbox is greater than 10
  //and to implement downarrow key and uparrow key functionality, the vertical scrollbar in selectbox will
  //be visible if the horizontal scrollbar of DIV is exremely right.
  if (document.getElementById(divId).scrollLeft != 0)
  {
    // document.getElementById(divId).scrollLeft = 0;
  }

  //Checks if count of items in Selectbox is greater than 8, if yes then making the size of the selectbox to 8.
  //So that on pressing of downarrow key or uparrowkey, the selected item should also scroll up or down as expected.
  if (selectObj.options.length > 10)
  {
    // selectObj.focus();
    // selectObj.size=10;
  }

}

function escapeSingleQuotes(str) {
  return str.replace(/\'/g, "\\'");
}


function escapeSingleQuotesSQL(str) {
  return str.replace(/\'/g, "''");
}


// calculate the real top position of a table/div/element
function getTopPos(el) {
  var iPos = 0;
  while (el != null) {
    iPos += el.offsetTop;
    el = el.offsetParent;
  }
  return iPos;
}
// get the Width of an Object's top parent
function getTopWidth(el) {
  var iPos = 0;
  while (el != null) {
    iPos = el.offsetWidth;
    el = el.offsetParent;
  }
  return iPos;
}
// get the Height of an Object's top parent
function getTopHeight(el) {
  var iPos = 0;
  while (el != null) {
    iPos = el.offsetHeight;
    el = el.offsetParent;
  }
  return iPos;
}

// get the Height of an Object
function getHeight(oName) {
  var iPos = 0;
  var el = document.getElementById(oName);
  iPos = el.offsetHeight;
  return iPos;
}
// get the Width of an Object
function getWidth(oName) {
  var iPos = 0;
  var el = document.getElementById(oName);
  iPos = el.offsetWidth;
  return iPos;
}

// Finds out if a is an ancestor of b
function contains(a, b)
{
  // we climb through b parents
  // till we find a
  while (b && (a != b) && (b != null))
    b = b.parentNode;
  return a == b;
}

// add / attach and event using either MS or W3
function addEvent(eName,func) {
  if (navigator.userAgent.indexOf('MSIE') == -1) {
    addEventListener(eName, func, true);
  } else {
    attachEvent('on' + eName, func);
  }
}

// get the DPI for IE, Firfox only uses 96 internally (according to several web sites in 8/2007)
function getDeviceDPI() {
  if ((window.screen) && (window.screen.deviceXDPI)) {
    return parseInt(window.screen.deviceXDPI, 10);
  } else if (document.defaultView) {
    return 96;
  } else {
    return NaN;
  }
}

// see if browser is IE compatable
function iecompattest() {
  return (document.compatMode && document.compatMode != 'BackCompat') ? document.documentElement : document.body;
}

// get window height, independant of browser type -- support standards mode only (alf 12/20/2011)
function get_win_h() {
  return document.documentElement.clientHeight;
}
// get window width, independant of browser type -- support standards mode only (alf 12/20/2011)
function get_win_w() {
  return document.documentElement.clientWidth;
}


// get document width, independant of browser type
function get_doc_w() {
  if (isIE() == true) {
    return document.body.style.width;
  } else {
    return document.documentElement.offsetWidth;
  }
}

// is the browser agent IE
function isIE() {
  if (navigator.userAgent.indexOf('MSIE') == -1) {
    return false;
  } else {
    return true;
  }
}

// greater than and less than function for use inside of a XSL document.
function isGTR(a,b) {
  if (a > b)
    return true;
  else
    return false;
}
function isLSS(a,b) {
  if (a < b)
    return true;
  else
    return false;
}


function convertToOriginalSymbols(strVal) {
  /* When the Grid control (used by ProjList, PortList, ProjMgmt...) display the name which has "LESS THAN" symbol "<",
    it converts the symbols to special code '#%cLt#%'. Therefore, this function used convert the code back to
    its original symbol before displaying  */

  var searchFor = /#%cLt#%/g;  // regular expression string
  var replaceWith = '&lt;';
  var origVal = strVal.replace(searchFor, replaceWith);

  return origVal;
}



function ToggleAll(strClass) {
  $('.' + strClass)
        .each(function() {
        if ($(this).get(0).checked == true) {
          $(this).get(0).checked = false;
        } else {
          $(this).get(0).checked = true;
        }
      }
      );
}

function checkAll(strClass, chkState) {
  $('.' + strClass)
      .each(function() {
        if (chkState) {
          $(this).get(0).checked = true;
        } else {
          $(this).get(0).checked = false;
        }
      }
      );
}

function escapeBackslashes(str) {
  return str.replace(/\\/g, '\\\\');
}

// Generic Event Attacher for FireFox and IE
function AttachEvent(obj, eventName, eventHandler) {
  if (obj) {
    if (eventName.substring(0, 2) == 'on') {
      eventName = eventName.substring(2, eventName.length);
    }
    if (obj.addEventListener) {
      obj.addEventListener(eventName, eventHandler, false);
    } else if (obj.attachEvent) {
      obj.attachEvent('on' + eventName, eventHandler);
    }
  }
}

// Example: AttachEvent(frameObject, 'load', myOnLoadFunction);


// Browser Navigator check for EPS compatibility
function BrowserCheck() {
  var browserBrand = navigator.userAgent;
  if (browserBrand.indexOf('Netscape') > -1 || browserBrand.indexOf('Navigator') > -1) {
    alert('Netscape Navigator Detected');
    window.location.href = 'browsercompat.html';
  }
  if (browserBrand.indexOf('Safari') > -1 && browserBrand.indexOf('Chrome') == -1) {
    var version = browserBrand.substr(browserBrand.lastIndexOf('Version/') + 8, 5);
    version = version.replace(/[^0-9]+/g, '');
    if (parseInt(version, 10) < 512) {
      alert('Safari version ' + version + ' detected -- EPS does not support this version.  Please update to version 5.1.2 or greater');
      window.location.href = 'browsercompat.html';
    }
  }
}
// choose select by value
function setSelectedValue(sListID,txtVal) {
  var sList;
  var idxPos = 0;
  var i = 0;
  sList = document.getElementById(sListID);
  for (i = 0; i < sList.length; i++) {
    if (sList.options[i].value == txtVal) {
      idxPos = i;
      sList.options[i].selected = true;
    }
  }
}

function addToSelectList(sListID, sVal, sTxt) {
  var sList;
  var elOptOld;
  var idxPos = 0;
  var i = 0;
  sList = document.getElementById(sListID);
  i = sList.selectedIndex;
  elOptOld = sList.options[i];
  var elOptNew = document.createElement('option');
  elOptNew.value = sVal;
  elOptNew.text = sTxt;
  try {
    sList.add(elOptNew, elOptOld); // standards compliant; doesn't work in IE
  } catch (ex) {
    sList.add(elOptNew, i); // IE only
  }
  sList.selectedIndex = i;

}

function mi_ExportAsExcelChart(lnkObj, rptname, fclass, tempid, pid) {
  // ' ExcelExport.aspx?rtype=projreports&report=Qa_excel_table&tempid=100&projid=541

  // create link
  var lnk = 'ExcelExport.aspx?rtype=' + fclass + 'reports&report=' + rptname + '&tempid=' + tempid + '&' + fclass + 'id=' + pid;
  lnkObj.attr('href', lnk);
  return true;
}

// variables and function for display countdown time before closing session due to timeout

var g_seconds = 0;
var g_minutes;
var g_SesnTimeoutOn = true;

function displayCountdown() {
  $(document).stopTime('display_time_count');
  if (g_seconds <= 0) {
    g_seconds = 60;
    g_minutes -= 1;
  }

  if (g_minutes <= -1) {
    g_seconds = 0;
    g_minutes += 1;
  }
  else {
    g_seconds -= 1;

    if (g_seconds <= 9) {
      g_seconds = '0' + g_seconds;
    }

    $('#p_countdown').text(g_minutes + ':' + g_seconds + ' (min:sec).');
    $(document).oneTime(1000, 'display_time_count', displayCountdown);
  }
}

function openDrilldownNode(s ) {
  var dd_tempArr, strURL, ddwin;
  dd_tempArr = s.split('dd_win');
  ddwin = dd_tempArr[0];
  strURL = dd_tempArr[1];

  ddwin = ddwin.replace(',', '_');
  ddwin = ddwin.replace('.', '_');
  window.open(strURL, ddwin, 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,copyhistory=no,width=650,height=550');
}


function reloadLastLoadedNode(tid, pid, vname, mode, iotype, sesn_id) {
  var aspxfile, qstr;

  if (mode == 'proj') {
    aspxfile = 'ProjSelect.aspx?';
    qstr = 'openProject=true&openvar=' + vname + '&projid=' + pid + '&tempid=' + tid + '&wi_iotype=' + iotype;
  }
  else {
    aspxfile = 'PortAnalyze.aspx?';
    qstr = 'openvar=' + vname + '&portid=' + pid + '&tempid=' + tid + '&iotype=' + iotype;
  }

  // Re-open the main window base on the sesssion ID
  eps_window = window.open('', sesn_id);
  if (eps_window) {
    if (vname != '') {
      urlink = aspxfile + qstr;
      eps_window.open(urlink, sesn_id);
    }
    else {
      // Reload the non-input/output page
      eps_window.location.reload();
    }
  }
}

function AJAX_putLastLoadedNode(epspath, vname, pid, tid, iotype, mode) {
  // use AJAX to update database with the last node loaded on proj/port input/output/form  panel
  var queryString;
  var objAjax = new AjaxObject();

  queryString = 'putdata=last_loaded_node&node_data=' + mode + '-' + iotype + '-' + tid + '-' + pid + '-' + vname;

  if (queryString.length != 0)
  {
    initAjaxRequestUrl(epspath, 'AjaxRequest.aspx');
    objAjax.Get_CallBack(queryString);
  }
  else
  {
    objAjax.AbortCallBack();
  }
}

function AJAX_clearLastLoadedNode(epspath, msg) {
  // use AJAX to update database with the last node loaded on proj/port input/output/form  panel
  var queryString;
  var objAjax = new AjaxObject();

  queryString = 'putdata=last_loaded_node&node_data=clear';

  if (queryString.length != 0)
  {
    initAjaxRequestUrl(epspath, 'AjaxRequest.aspx');
    objAjax.Get_CallBack(queryString);
  }
  else
  {
    objAjax.AbortCallBack();
  }
}

function set_SessionTimeoutControl(setState, caller) {
  g_SesnTimeoutOn = setState;
  // alert ('Debug only: set_SessionTimeoutControl to '  +  setState  + ' by '+ caller);
  if (setState) { // Turn ON session timeout control Timers
    set_KeepSessionAlive(setState);
  }
}

function requireOnce(url) {
  //  Check the DOM for the script tag corresponding to the javascript file your want to check
  // if not there then you can include it
  if (!$("script[scr='" + url + "']").length) {
    $('head').append("<script type='text/javascript' src='" + url + "'></script>");
  }
}

function getWindowSize(what) {
  /* -------------------------------------
  called by "comment edit" functions
  to retrieve the width and height of
  navtree and header windows.
   ------------------------------------ */
  if (what == 'w')
    return $(window).width();

  if (what == 'h')
    return $(window).height();
  else
    return 0;
}

var g_dOpen = 0;
function disableAllLinks(dialgID, noCheck) {
  /* =======================================================
   This function used by
     - session timeout control functions
     - comment edit function
    to disable all elements and links in the current windows
    by open MODAL-DIALOG and hide it immediately
    > When noCheck is true, just open the dialog and hide it
 ======================================================== */
  if (noCheck == true) {
    $('#' + dialgID).dialog('open');
    $('div[aria-labelledby$=' + dialgID + ']').hide();
  }
  else {
    if (g_dOpen == 0) {
      $('#' + dialgID).dialog('open');
      // {developer-note: the trick to retrieve the outer DIV object of the Dialog is to use it's attribute "aria-labelledby"
      $('div[aria-labelledby$=' + dialgID + ']').hide();
    }
    g_dOpen += 1;
  }
}

function enableAllLinks(dialgID, noCheck) {
  /* =======================================================
   This function used by
     - session timeout control functions
     - comment edit function
    to restore form elements and links to normal behavior.
   ======================================================== */
  if (noCheck == true)
    $('#' + dialgID).dialog('close');
  else
  {
    if (g_dOpen > 0)
      g_dOpen -= 1;

    if (g_dOpen == 0)
      $('#' + dialgID).dialog('close');
  }
}

function createDialogToDisableLinks(dialgID) {

  $('#' + dialgID).dialog({
    autoOpen: false,
    modal: true
  });
}


/* ============================================
 Example of how to create a 2D array using
 the following Array2D()function
 --------------------------------------
 var theLen = 5
 arrAttr = new Array();
 arrAttr[0] = new Array2D();
 arrAttr[0].setArray(theLen);
 arrAttr[1] = new Array2D();
 arrAttr[1].setArray(theLen);
============================================= */

function Array2D() {
  function setArray(length) { // set an array inside the object
    this.elem = new Array();
    for (i = 0; i < length; i++) {
      this.elem[i] = null;
    }
  }
  this.setArray = setArray;
  this.elem = null; // our array
}
