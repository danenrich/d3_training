//  Specifically Reworked by Matt Muyres for Enrich Consulting to support a more complex behavior




// BEGIN  ColorWheelPicker  Specific Methods and containers
//  Based on Farbtastic Color Wheel using jQuery

// requires  jquery.js be loaded first
// requires  farbtastic.js be loaded first
// requires  AnchorPopUp.js be loaded first


// Object Containers for Input that will hold the color value and the Button that will be colored
// these are currenlty overloaded using jquery methods
ColorWheelPicker_targetInput = null;
ColorWheelPicker_targetButton = null;
ColorWheelPicker_canxColor = null;



// Main Creation Routine, used to make the object.
var ColorWheelPicker_debug = false;


var cButton = null;  // button
var cValueHolder = null;   // value
var cCheckBox = null;   // checkbox
var fbCustomPicker = null;
var CustomPicker = null;
var selected;
var CustomPicker_init = false;

function ColorWheelPicker()
{
  var cwp_init = false;
  var windowMode = false;
  if (arguments.length == 0)
  {
    var divname = 'customPickerDiv';
  }
  else if (arguments[0] == 'window')
  {
    var divname = '';
    windowMode = true;
  }
  else
  {
    var divname = arguments[0];
  }
  if (divname != '')
  {
    var cp = new PopupWindow(divname);
  }
  else
  {
    var cp = new PopupWindow();
    cp.setSize(225, 250);
  }

  //parent object methods and overloads
  cp.currentValue = '#FFFFFF';
  cp.writeDiv = ColorWheelPicker_writeDiv;
  cp.highlightColor = ColorWheelPicker_highlightColor;
  cp.show = ColorWheelPicker_show;
  cp.hide = ColorWheelPicker_hide;
  cp.select = ColorWheelPicker_select;
  cp.canx = ColorWheelPicker_canx;

  cp.hidePopUpCallBack = ColorWheelPicker_AutoHide;
  //    cp.hidePopUpCallBack=ColorWheelPicker_canx;


  // begin local object methods
  cp.ok = ColorWheelPicker_ok;
  cp.setCanxColor = ColorWheelPicker_setCanxColor;
  cp.init = ColorWheelPicker_init;
  cp.setColorValue = ColorWheelPicker_setColorValue;

  if (ColorWheelPicker_debug) {
    alert('CheckBox State:' + cCheckBox);
  }

  var use_highlight = (document.getElementById || document.all) ? true : false;

  var cp_contents = '';
  var windowRef = (windowMode) ? 'window.opener.' : '';
  if (windowMode)
  {
    cp_contents += '<HTML><HEAD><TITLE>Select Color</TITLE></HEAD>';
    cp_contents += '<BODY MARGINWIDTH=0 MARGINHEIGHT=0 LEFTMARGIN=0 TOPMARGIN=0><CENTER>';
  }

  cp_contents += "<TABLE class='cpotbl' border=0 align='center'><TR><TD colspan='2'>";
  cp_contents += "<TABLE class='cpitbl' border=0 align='center'>";

  cp_contents += "<TR><TD colspan='2'>";
  cp_contents += '<SPAN ID=\"customPicker\" STYLE=\"position:relative;visibility:visible;\"> </SPAN>';
  cp_contents += '</TD></TR>';
  cp_contents += '</TABLE>';
  cp_contents += '</TD></TR>';
  cp_contents += "<TR CLASS='cpcust'>";
  cp_contents += "<TD class='cpcust' onClick='" + windowRef + 'ColorWheelPicker_ok(' + windowRef + 'window.popupWindowObjects[' + cp.index + "]); return false;'> <IMG SRC='images/ok-button.gif'/> </TD>";
  cp_contents += "<TD class='cpcust' onClick='" + windowRef + 'ColorWheelPicker_canx(' + windowRef + 'window.popupWindowObjects[' + cp.index + "]); return false;'>  <IMG SRC='images/cancel-button.gif'/>  </TD>";
  cp_contents += '</TR>';
  cp_contents += '</TD></TR></TABLE>';

  if (windowMode)
  {
    cp_contents += '</CENTER></BODY></HTML>';
  }

  cp.populate(cp_contents + '\n');
  cp.offsetY = 15;
  cp.offsetX = 25;
  cp.autoHide();

  return cp;
}

// call back function to set button color and hidden input that hold color value
// notice the amp entries, used only if JS is in XSL
function ColorWheelPicker_setColorValue(arg) {
  if (cButton != null && cValueHolder != null) {

    if (cCheckBox == true) {
      if (arg != null && typeof arg == 'string') {
        var tCol = arg.toUpperCase();
        if (window.hex == false) {
          document.getElementById(cValueHolder).value = tCol.replace('#', '');
        } else {
          document.getElementById(cValueHolder).value = tCol;
        }
      } else {
        document.getElementById(cValueHolder).value = arg;
      }
      document.getElementById(cButton).style.backgroundColor = arg;
    }
  }

}

// overloads to abstract Custom Color Wheel in other JavaScripts
function showCustomColorWheel() {
  if (ColorWheelPicker_debug) {
    alert('showCustomColorWheel!');
  }
  $(selected = this);
  $('#customPicker').show();
  $('#customPicker').css('opacity', 1);

}
function ColorWheelPicker_hideCustomColorWheel() {
  if (ColorWheelPicker_debug) {
    alert('ColorWheelPicker_hideCustomColorWheel!');
  }
  $('#customPicker').hide();
  //  $('#customPicker').css('opacity', 0.25);
}

function ColorWheelPicker_init() {
  if (CustomPicker_init == false) {
    CustomPicker_init = true;

    if (ColorWheelPicker_debug) {
      alert('ColorWheelPicker_init!');
    }

    // jQuery definition that set farbastic behavior
    // we will bind on clicking the check box but on show unless custom is set, this lets the custom wheel sync to active color
    $(document).ready(function() {
      $('#customPicker').hide();
      fbCustomPicker = $.farbtastic('#customPicker');
      CustomPicker = $('#customPicker').css('opacity', 0.25);

      $('.colorbtn')
        .each(function() { $(this).css('opacity', 1); })
        .click(function() {
            var cBox = $(this).get(0).name.replace('_color', '_def');
            if (ColorWheelPicker_debug) {
              alert('CheckBox State:' + cCheckBox);
              alert('Bound To:' + cBox);
            }
            cCheckBox = document.getElementById(cBox).checked;
            if (cCheckBox == true) {
              cButton = $(this).get(0).name;
              cValueHolder = $(this).get(0).name.replace('_color', '_val');
              fbCustomPicker.linkTo(ColorWheelPicker_setColorValue);
              $(selected = this).addClass('colorwell-selected');
            } else {
              $(this).removeClass('colorwell-selected');
              cButton = null;
              cValueHolder = null;
            }
          });

      $('.actwell')
        .each(function() { $(this).css('opacity', 1); })
        .click(function() {
            cCheckBox = $(this).attr('checked');
            cButton = null;
            cValueHolder = null;
            if (cCheckBox == true) {
              fbCustomPicker.linkTo(ColorWheelPicker_setColorValue);
              $(selected = this).addClass('colorwell-selected');
            } else {
              fbCustomPicker.unLink(ColorWheelPicker_setColorValue);
              $(this).removeClass('colorwell-selected');
            }
          });
    });
    showCustomColorWheel();
    // now that events are registered we need to fire off a click to sync the whole thing
    window.ColorWheelPicker_targetButton.click();
  }
}


// Initalization Function to create DIV - will be move to Anchor when displayed
function ColorWheelPicker_writeDiv()
{
  if (ColorWheelPicker_debug) {
    alert('ColorWheelPicker_writeDiv!');
  }
  document.writeln('<DIV ID=\"customPickerDiv\" STYLE=\"align:center;position:absolute;visibility:hidden;\"> </DIV>');
}

function ColorWheelPicker_show(anchorname)
{
  if (ColorWheelPicker_debug) {
    alert('ColorWheelPicker_show!');
  }
  showCustomColorWheel();
  this.showPopup(anchorname);
  this.visible = true;
  ColorWheelPicker_init();
}

function ColorWheelPicker_pickColor(color,obj)
{
  ColorWheelPicker_hideCustomColorWheel();
  obj.hidePopup();
}

function ColorWheelPicker_hide(obj)
{
  this.visible = false;
  ColorWheelPicker_hideCustomColorWheel();
  if (obj != null) {
    obj.hidePopup();
  }
}

function ColorWheelPicker_select(inputobj,btnobj,linkname)
{
  if (inputobj.type != 'text' && inputobj.type != 'hidden' && inputobj.type != 'textarea')
  {
    alert('CustomPicker.select: Input object passed is not a valid form input object');
    window.ColorWheelPicker_targetInput = null;
    return;
  }
  if (ColorWheelPicker_debug) {
    alert('ColorWheelPicker_select @ ' + linkname);
  }
  window.ColorWheelPicker_targetInput = inputobj;
  window.ColorWheelPicker_targetButton = btnobj;
  this.show(linkname);
}

function ColorWheelPicker_highlightColor(c)
{
  ColorWheelPicker_setCanxColor(c);
  ColorWheelPicker_setColorValue(c);
  if (c != null) {
    fbCustomPicker.setColor('#' + c.replace('#', '').toUpperCase());
  }

  if (ColorWheelPicker_debug) {
    alert('ColorWheelPicker_highlightColor @ ' + c);
  }
}

function ColorWheelPicker_setCanxColor(c)
{
  ColorWheelPicker_canxColor = c;
  if (ColorWheelPicker_debug) {
    alert('ColorWheelPicker_setCanxColor @ ' + c);
  }
}

// ensure we do not do a callback and revert our selection
function ColorWheelPicker_ok(obj)
{
  // var tmpCallBack = obj.hidePopUpCallBack;
  // obj.hidePopUpCallBack = null;
  obj.okPressed = true;
  ColorWheelPicker_hideCustomColorWheel();
  if (obj != null) {
    obj.hidePopup();
  }
  //  obj.hidePopUpCallBack = tmpCallBack;
  return true;
}


function ColorWheelPicker_canx(obj)
{
  obj.okPressed = false;
  if (ColorWheelPicker_canxColor != null) {
    ColorWheelPicker_setColorValue(ColorWheelPicker_canxColor);
  }
  ColorWheelPicker_hideCustomColorWheel();
  if (obj != null) {
    obj.hidePopup();
  }
  if (ColorWheelPicker_debug) {
    alert('ColorWheelPicker_canx is reverting color:' + ColorWheelPicker_canxColor);
  }
  // obj.ok = true;
  return false;
}


function ColorWheelPicker_AutoHide(obj) {
  // obj.ok = false;

  if (ColorWheelPicker_canxColor != null && obj.visible && obj.okPressed != true) {
    ColorWheelPicker_setColorValue(ColorWheelPicker_canxColor);
    obj.visible = false;
  }
  ColorWheelPicker_hideCustomColorWheel();
  if (obj != null) {
    obj.hidePopup();
  } else {
    alert('Bad Object for AutoHide');
  }
  return false;
}
