
//**********************************************************************
//  BEGIN CUSTOM DIALOG CODE (Reworked by Matt Muyres)
//***********************************************************************/
// Global for brower version branching.
var Nav4 = ((navigator.appName == 'Netscape') && (parseInt(navigator.appVersion) >= 4));

// One object tracks the current window opened from this window.
var customWin = new Object();

// Generate a custom window
// Parameters:
//   winName -- window Name
//    url -- URL of the page/frameset to be loaded into dialog
//    width -- pixel width of the dialog window
//    height -- pixel height of the dialog window
//   parentWin  --  handle of the parent window that made this
//  winDockType  -- support docking window to parent (left|right|top|bottom|none)
//    returnFunc -- reference to the function (on this page)
//                  that is to act on the data returned from the dialog
//    args -- [optional] any data you need to pass to the dialog
function openCustomWin(winName, url, width, height, parentWin, winDockType, returnFunc, args) {
  if (!customWin.win || (customWin.win && customWin.win.closed)) {
    // Initialize properties of the Modal dialog object.
    customWin.returnFunc = returnFunc;
    customWin.returnedValue = '';
    customWin.args = args;
    customWin.url = url;
    customWin.width = width;
    customWin.height = height;
    customWin.name = winName;
    customWin.parentWin = parentWin;
    customWin.dockType = winDockType;

    var parWinX = 100, parWinY = 100, totW = 100, totH = 100;
    var winXoff = 50;


    if (customWin.dockType == 'left') {
      parWinX = screen.width - parentWin.document.body.offsetWidth;
      parWinY = screen.height - parentWin.document.body.offsetHeight;

      totW = customWin.width + parentWin.document.body.offsetWidth;
      totH = customWin.height + parentWin.document.body.offsetHeight;
      winXoff = (screen.width - totW) / 2;

      customWin.left = winXoff - 10;
      customWin.top = 50;

      parWinX = customWin.left + customWin.width + 10;
      parWinY = 50;

      customWin.height = parentWin.document.body.offsetHeight;
    }

    // Assemble window attributes and try to center the dialog.
    if (Nav4) {
      // Center on the main window.
      customWin.left = window.screenX +
          ((window.outerWidth - customWin.width) / 2);
      customWin.top = window.screenY +
          ((window.outerHeight - customWin.height) / 2);
      var attr = 'screenX=' + customWin.left +
          ',screenY=' + customWin.top + ',resizable=yes,scrollbars=no,width=' +
          customWin.width + ',height=' + customWin.height;
    } else {
      // The best we can do is center in screen.
      if (customWin.left == 0) {
        customWin.left = (screen.width - customWin.width) / 2;
        customWin.top = (screen.height - customWin.height) / 2;
      }

      var attr = 'left=' + customWin.left + ',top=' +
          customWin.top + ',resizable=yes,scrollbars=no,width=' + customWin.width +
          ',height=' + customWin.height;
    }

    // Generate the dialog and make sure it has focus.
    customWin.win = window.open(customWin.url, customWin.name, attr);
    customWin.win.focus();

    parentWin.moveTo(parWinX, parWinY);

    customWin.name = winName;
    customWin.parentWin = parentWin;
    customWin.dockType = winDockType;


  } else {
    recalcDock(customWin.win, parentWin);
    customWin.win.focus();
  }
}


// make docking coord and move windows
function recalcDock(winC,winP) {
  var parWinX = 100, parWinY = 100, totW = 100, totH = 100;
  var cWinX = 100, cWinY = 100;
  var winXoff = 50;

  if (!winC.dockType || winC.dockType == 'left') {
    parWinX = screen.width - winP.document.body.offsetWidth;
    parWinY = screen.height - winP.document.body.offsetHeight;


    totW = winC.document.body.offsetWidth + winP.document.body.offsetWidth;
    totH = winC.document.body.offsetHeight + winP.document.body.offsetHeight;
    winXoff = (screen.width - totW) / 2;

    cWinX = winXoff - 10;
    cWinY = 50;

    winC.height = winP.document.body.offsetHeight;

    parWinX = cWinX + winC.document.body.offsetWidth + 10;
    parWinY = 50;

  }
  winC.moveTo(cWinX, cWinY);
  winP.moveTo(parWinX, parWinY);
}

// Event handler to inhibit Navigator form element
// and IE link activity when dialog window is active.
function deadend2() {
  if (customWin.win && !customWin.win.closed) {
    customWin.win.focus();
    return false;
  }
}

// Since links in IE4 cannot be disabled, preserve
// IE link onclick event handlers while they're "disabled."
// Restore when re-enabling the main window.
var IELinkClicks;

// Disable form elements and links in all frames for IE.
function disableForms2() {
  IELinkClicks = new Array();
  for (var h = 0; h < frames.length; h++) {
    for (var i = 0; i < frames[h].document.forms.length; i++) {
      for (var j = 0; j < frames[h].document.forms[i].elements.length; j++) {
        frames[h].document.forms[i].elements[j].disabled = true;
      }
    }
    IELinkClicks[h] = new Array();
    for (i = 0; i < frames[h].document.links.length; i++) {
      IELinkClicks[h][i] = frames[h].document.links[i].onclick;
      frames[h].document.links[i].onclick = deadend2;
    }
    frames[h].window.onfocus = checkModal2;
    frames[h].document.onclick = checkModal2;
  }
}

// Restore IE form elements and links to normal behavior.
function enableForms2() {
  for (var h = 0; h < frames.length; h++) {
    for (var i = 0; i < frames[h].document.forms.length; i++) {
      for (var j = 0; j < frames[h].document.forms[i].elements.length; j++) {
        frames[h].document.forms[i].elements[j].disabled = false;
      }
    }
    for (i = 0; i < frames[h].document.links.length; i++) {
      frames[h].document.links[i].onclick = IELinkClicks[h][i];
    }
  }
}

// Grab all Navigator events that might get through to form
// elements while dialog is open. For IE, disable form elements.
function blockEvents2() {
  if (Nav4) {
    for (var h = 0; h < parent.frames.length; h++) {
      parent.frames[h].window.captureEvents(Event.CLICK | Event.MOUSEDOWN | Event.MOUSEUP | Event.FOCUS);
      parent.frames[h].window.onclick = deadend2;
    }
  } else {
    disableForms2();
  }
  window.onfocus = checkModal2;
}
// As dialog closes, restore the main window's original
// event mechanisms.
function unblockEvents2() {
  if (Nav4) {
    for (var h = 0; h < parent.frames.length; h++) {
      parent.frames[h].window.releaseEvents(Event.CLICK | Event.MOUSEDOWN | Event.MOUSEUP | Event.FOCUS);
      parent.frames[h].window.onclick = null;
      parent.frames[h].window.onfocus = null;
    }
  } else {
    enableForms2();
  }
}

// Invoked by onFocus event handler of EVERY frame,
// return focus to dialog window if it's open.
function checkModal2() {
  setTimeout('finishChecking2()', 50);
  return true;
}

function finishChecking2() {
  if (customWin.win && !customWin.win.closed) {
    customWin.win.focus();
  }
}

// for docked window    body onMove=
function dockThis(e) {
  opener.screenX = window.screenX - opener.outerWidth;
  opener.screenY = window.screenY - opener.outerWidth;
  alert('dock adjusting windows');
}


//**************************
//  END CUSTOM DIALOG CODE
//**************************/


