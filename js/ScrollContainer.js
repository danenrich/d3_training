//========[BEGIN]========= Matts Magic Scrolling Container Size Setter
// Automaticall sets the tables size to a relative % of the remainder of the screen to trap a scrolling division
// basic usage:
// Make a table with an ID of [tbl_ID]+'Container'
// Put a division inside the <TD> with ID of [tbl_ID]+'Holder'
// Use the onload event handler to call function
// See Also: style definions: .container .noscroll

function setContainerSize(tbl_ID, relPCT ) {

  var TopSpot = 0;
  var fSize = 0;
  var pctSize = 0.95;

  if (relPCT) { pctSize = relPCT / 100; }

  if (document.getElementById(tbl_ID + 'Container') != null) {
    TopSpot = getRealTopPos(document.getElementById(tbl_ID + 'Container'));
    fSize = document.documentElement.clientHeight - TopSpot;
  }

  if (document.getElementById(tbl_ID + 'Holder') != null && fSize > 1) {
    document.getElementById(tbl_ID + 'Holder').style.height = fSize * pctSize;
  }

  return fSize;
}

// calculate the real top position of a table/div/element
// used to determine valid heights that will not make the screen scroll
function getRealTopPos(el) {
  var iPos = 0;
  while (el != null) {
    iPos += el.offsetTop;
    el = el.offsetParent;
  }
  return iPos;
}

//========[END]========= Matts Magic Scrolling Container Size Setter


//======[BEGIN]=================Customized Form Field Highlighting  =======================
// Adapted from source found at http://www.dynamicdrive.com.

//Highlight form element- © Dynamic Drive (www.dynamicdrive.com)
//For full source code, 100's more DHTML scripts, and TOS,
//visit http://www.dynamicdrive.com

var highlightcolor = 'yellow';

var ns6 = document.getElementById && !document.all;
var previous = '';
var eventobj;

//Regular expression to highlight only form elements
var intended = /INPUT|TEXTAREA|SELECT|OPTION/;

//Function to check whether element clicked is form element
function checkel(which) {
  if (which.style && intended.test(which.tagName)) {
    if (ns6 && eventobj.nodeType == 3)
      eventobj = eventobj.parentNode.parentNode;
    return true;
  } else
    return false;
}

//Function to highlight form element
function highlight(e) {
  eventobj = ns6 ? e.target : event.srcElement;
  if (previous != '') {
    if (checkel(previous))
      previous.style.backgroundColor = '';
    previous = eventobj;
    if (checkel(eventobj))
      eventobj.style.backgroundColor = highlightcolor;
  } else {
    if (checkel(eventobj))
      eventobj.style.backgroundColor = highlightcolor;
    previous = eventobj;
  }
}
//======[END]=================Customized Form Field Highlighting  =======================


function centerWindow(w) {


  var left = (screen.width / 2) - w.document.body.offsetWidth / 2;
  var top = (screen.height / 2) - w.document.body.offsetHeight / 2;

  w.moveTo(left, top);
}



/***********************************************
* Disable "Enter" key in Form script- By Nurul Fadilah(nurul@REMOVETHISvolmedia.com)
* This notice must stay intact for use
* Visit http://www.dynamicdrive.com/ for full source code
*  e.g onkeypress="return handleEnter(this, event)"
***********************************************/

function handleEnter(field, event) {
  var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
  if (keyCode == 13) {
    var i;
    for (i = 0; i < field.form.elements.length; i++)
      if (field == field.form.elements[i])
        break;
      i = (i + 1) % field.form.elements.length;
    field.form.elements[i].focus();
    return false;
  }
  else
    return true;
}
