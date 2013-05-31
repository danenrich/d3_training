//  Specifically Reworked by Matt Muyres for Enrich Consulting to support a more complex behavior


// requires  AnchorPopUp.js be loaded first







// BEGIN  ColorPicker  Specific Methods and containers

// the following var's are created by gcolorpick.xsl
//   ColorPicker_cols    - number of columns in grid
//   ColorPicker_size   - size of TD in grid
//   ColorPicker_scheme   - name of color scheme
//   ColorPicker_colors   - array of color values

// Object Containers for Input that will hold the color value and the Button that will be colored
ColorPicker_targetInput = null;
ColorPicker_targetButton = null;
ColorPicker_CustomButton = null;
ColorPicker_canxColor = null;


ColorPicker_AnchorName = null;

// Initalization Function to create DIV - will be move to Anchor when displayed
function ColorPicker_writeDiv()
{
  document.writeln('<DIV ID=\"colorPickerDiv\" STYLE=\"position:absolute;visibility:hidden;\"> </DIV>');
}


// register the CustomWheelPicker
function ColorPicker_setCustom(obj)
{
  ColorPicker_CustomButton = obj;
  ColorPicker_CustomButton.hex = window.hex;
}

// show the CustomWheelPicker
function ColorPicker_showCustom()
{
  if (ColorPicker_CustomButton != null) {
    //    ColorPicker_CustomButton.show(ColorPicker_AnchorName);
    ColorPicker_CustomButton.hex = window.hex;
    ColorPicker_CustomButton.select(window.ColorPicker_targetInput, window.ColorPicker_targetButton, ColorPicker_AnchorName);
    ColorPicker_CustomButton.highlightColor(ColorPicker_canxColor);

  }
}

// hide the CustomWheelPicker
function ColorPicker_hideCustom()
{
  if (ColorPicker_CustomButton != null) {
    ColorPicker_CustomButton.hide();
  }
}

function ColorPicker_show(anchorname)
{
  this.ok = true;
  ColorPicker_AnchorName = anchorname;
  this.showPopup(anchorname);

  var cSquareSize = window.cSize + 'px';
  var cSchemeTitle = 'Color Palette Name: ' + ColorPicker_scheme;

  $('.cpdiv')
        .each(function() {
        $(this).css('width', cSquareSize);
        $(this).css('height', cSquareSize);
      });

  if (ColorPicker_scheme != null) {
    $('.cpInfo')
        .each(function() {
          $(this).attr('title', cSchemeTitle);
        });
  }


}

function ColorPicker_pickColor(color,obj)
{
  obj.okPressed = true;
  obj.hidePopup();
  pickColor(color);
}

function ColorPicker_hide(obj)
{
  obj.hidePopup();
}

function pickColor(color)
{
  if (window.ColorPicker_targetInput == null)
  {
    alert("Target Input is null, which means you either didn't use the 'select' function or you have no defined your own 'pickColor' function to handle the picked color!");
    return;
  }
  if (window.hex == true) {
    window.ColorPicker_targetInput.value = '#' + color.replace('#', '');
  } else {
    window.ColorPicker_targetInput.value = color.replace('#', '');
  }
  window.ColorPicker_targetButton.style.background = color;
}

function ColorPicker_select2(inputobj,linkname)
{
  if (inputobj.type != 'text' && inputobj.type != 'hidden' && inputobj.type != 'textarea')
  {
    alert('colorpicker.select: Input object passed is not a valid form input object');
    window.ColorPicker_targetInput = null;
    return;
  }
  window.ColorPicker_targetInput = inputobj;
  this.show(linkname);
  this.hidePopUpCallBack = null;
}

function ColorPicker_select(inputobj,btnobj,linkname)
{
  if (inputobj.type != 'text' && inputobj.type != 'hidden' && inputobj.type != 'textarea')
  {
    alert('colorpicker.select: Input object passed is not a valid form input object');
    window.ColorPicker_targetInput = null;
    return;
  }
  window.ColorPicker_targetInput = inputobj;
  window.ColorPicker_targetButton = btnobj;
  this.hidePopUpCallBack = null;
  this.show(linkname);
}

function ColorPicker_highlightColor(c)
{
  var thedoc = (arguments.length > 1) ? arguments[1] : window.document;
  var d = thedoc.getElementById('colorPickerSelectedColor');
  try {
    d.style.backgroundColor = '#' + c.replace('#', '');
  } catch (err) {
    d.style.backgroundColor = '';
  }

  d = thedoc.getElementById('colorPickerSelectedColorValue');

  try {
    d.innerHTML = '#' + c.replace('#', '');
  } catch (err) {
    d.innerHTML = '';
  }

}


function ColorPicker_setCanxColor(c)
{
  ColorPicker_canxColor = c;
}

// Main Creation Routine, used to make the object.
function ColorPicker()
{
  var windowMode = false;
  if (arguments.length == 0)
  {
    var divname = 'colorPickerDiv';
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
  cp.currentValue = '#FFFFFF';
  cp.writeDiv = ColorPicker_writeDiv;
  cp.highlightColor = ColorPicker_highlightColor;
  cp.show = ColorPicker_show;
  cp.select = ColorPicker_select;

  cp.setCustom = ColorPicker_setCustom;
  cp.showCustom = ColorPicker_showCustom;
  cp.hideCustom = ColorPicker_hideCustom;

  cp.setCanxColor = ColorPicker_setCanxColor;

  cp.hidePopUpCallBack = ColorPicker_AutoHide;
  cp.init = null;
  cp.setColorValue = null;

  //    cp.ok = true;

  ColorPicker_canxColor = null;

  var colors = null;
  if (ColorPicker_colors != null) {
    colors = ColorPicker_colors;
  } else {
    colors = new Array('#000000', '#000033', '#000066', '#000099', '#0000CC', '#0000FF', '#330000', '#330033', '#330066', '#330099', '#3300CC',
        '#3300FF', '#660000', '#660033', '#660066', '#660099', '#6600CC', '#6600FF', '#990000', '#990033', '#990066', '#990099',
        '#9900CC', '#9900FF', '#CC0000', '#CC0033', '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#FF0000', '#FF0033', '#FF0066',
        '#FF0099', '#FF00CC', '#FF00FF', '#003300', '#003333', '#003366', '#003399', '#0033CC', '#0033FF', '#333300', '#333333',
        '#333366', '#333399', '#3333CC', '#3333FF', '#663300', '#663333', '#663366', '#663399', '#6633CC', '#6633FF', '#993300',
        '#993333', '#993366', '#993399', '#9933CC', '#9933FF', '#CC3300', '#CC3333', '#CC3366', '#CC3399', '#CC33CC', '#CC33FF',
        '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF', '#006600', '#006633', '#006666', '#006699', '#0066CC',
        '#0066FF', '#336600', '#336633', '#336666', '#336699', '#3366CC', '#3366FF', '#666600', '#666633', '#666666', '#666699',
        '#6666CC', '#6666FF', '#996600', '#996633', '#996666', '#996699', '#9966CC', '#9966FF', '#CC6600', '#CC6633', '#CC6666',
        '#CC6699', '#CC66CC', '#CC66FF', '#FF6600', '#FF6633', '#FF6666', '#FF6699', '#FF66CC', '#FF66FF', '#009900', '#009933',
        '#009966', '#009999', '#0099CC', '#0099FF', '#339900', '#339933', '#339966', '#339999', '#3399CC', '#3399FF', '#669900',
        '#669933', '#669966', '#669999', '#6699CC', '#6699FF', '#999900', '#999933', '#999966', '#999999', '#9999CC', '#9999FF',
        '#CC9900', '#CC9933', '#CC9966', '#CC9999', '#CC99CC', '#CC99FF', '#FF9900', '#FF9933', '#FF9966', '#FF9999', '#FF99CC',
        '#FF99FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF', '#33CC00', '#33CC33', '#33CC66', '#33CC99',
        '#33CCCC', '#33CCFF', '#66CC00', '#66CC33', '#66CC66', '#66CC99', '#66CCCC', '#66CCFF', '#99CC00', '#99CC33', '#99CC66',
        '#99CC99', '#99CCCC', '#99CCFF', '#CCCC00', '#CCCC33', '#CCCC66', '#CCCC99', '#CCCCCC', '#CCCCFF', '#FFCC00', '#FFCC33',
        '#FFCC66', '#FFCC99', '#FFCCCC', '#FFCCFF', '#00FF00', '#00FF33', '#00FF66', '#00FF99', '#00FFCC', '#00FFFF', '#33FF00',
        '#33FF33', '#33FF66', '#33FF99', '#33FFCC', '#33FFFF', '#66FF00', '#66FF33', '#66FF66', '#66FF99', '#66FFCC', '#66FFFF',
        '#99FF00', '#99FF33', '#99FF66', '#99FF99', '#99FFCC', '#99FFFF', '#CCFF00', '#CCFF33', '#CCFF66', '#CCFF99', '#CCFFCC',
        '#CCFFFF', '#FFFF00', '#FFFF33', '#FFFF66', '#FFFF99', '#FFFFCC', '#FFFFFF');
  }

  var total = colors.length;

  var width = 18;
  if (ColorPicker_cols != null) {
    width = ColorPicker_cols;
  }

  if (ColorPicker_debug) {
    alert('ColorArray:\n' + colors);
    alert('Width:' + width);
    alert('TotalColors:' + total);
  }

  window.cSize = 20;
  if (ColorPicker_size != null) {
    window.cSize = ColorPicker_size;
  }


  //var custLink = windowRef+".hidePopup(); chooseColor(window.ColorPicker_targetInput,window.ColorPicker_targetButton);return false;";


  var cp_contents = '';
  var windowRef = (windowMode) ? 'window.opener.' : '';
  if (windowMode)
  {
    cp_contents += '<HTML><HEAD><TITLE>Select Color</TITLE></HEAD>';
    cp_contents += '<BODY MARGINWIDTH=0 MARGINHEIGHT=0 LEFTMARGIN=0 TOPMARGIN=0><CENTER>';
  }

  cp_contents += "<TABLE class='cpotbl'><TR><TD>";
  cp_contents += "<TABLE class='cpitbl'>";


  //   cp_contents += "<TR CLASS='rh'><TD ALIGN='center' COLSPAN='"+width+"'><B>" + ColorPicker_scheme + "</B> Colors</TD></TR>";

  if (document.getElementById)
  {
    var width1 = Math.floor(width / 2);
    var width2 = width1;
    //        var width2 = Math.floor(width1/2);

    cp_contents += "<TR><TD CLASS='cptd' COLSPAN='" + width1 + "' BGCOLOR='#ffffff' ID='colorPickerSelectedColor'>&nbsp;</TD><TD CLASS='cptd' COLSPAN='" + width2 + "' ALIGN='CENTER' ID='colorPickerSelectedColorValue' STYLE='font-size:6pt' >#FFFFFF</TD></TR>";
  }

  var use_highlight = (document.getElementById || document.all) ? true : false;
  for (var i = 0; i < total; i++)
  {
    if ((i % width) == 0)
    {
      cp_contents += '<TR CLASS="cptr" >';
    }
    if (use_highlight)
    {
      var mo = 'onMouseOver="' + windowRef + 'ColorPicker_highlightColor(\'' + colors[i] + '\',window.document)"';
    }
    else
    {
      mo = '';
    }
    cp_contents += '<TD CLASS="cptd" onClick="' + windowRef + 'ColorPicker_pickColor(\'' + colors[i] + '\',' + windowRef + 'window.popupWindowObjects[' + cp.index + ']);return false;" ' + mo + '> <DIV class="cpdiv" style="background-color:' + colors[i] + '">&nbsp;</DIV> </TD>';
    if (((i + 1) >= total) || (((i + 1) % width) == 0))
    {
      cp_contents += '</TR>';
    }
  }


  // use farbastic  - CustomColorWheel
  //    cp_contents += "<TR CLASS='cpcust'><TD class='cpcust' COLSPAN='"+width+"' nowrap='nowrap'> <a href='#' class='cpcustImg' onClick='"+windowRef+"ColorPicker_hide("+windowRef+"window.popupWindowObjects["+cp.index+"]); "+windowRef+"window.ColorPicker_showCustom(); return false;'><IMG class='cpcustImg' SRC='images/more-button.gif'/></a> <span class='cpInfo'><IMG class='cpInfo' SRC='images/iconhelp.gif' /></span> </TD></TR>";
  cp_contents += "<TR CLASS='cpcust'><TD class='cpcust' COLSPAN='" + width + "' nowrap='nowrap'> <a href='#' class='cpcustImg' onClick='" + windowRef + 'ColorPicker_hide(' + windowRef + 'window.popupWindowObjects[' + cp.index + ']); ' + windowRef + "window.ColorPicker_showCustom(); return false;'><IMG class='cpcustImg' SRC='images/more-button.gif'/></a></TD></TR>";

  // use monkey butt
  //    cp_contents += "<TR CLASS='cpcust'><TD class='cpcust' COLSPAN='"+width+"' onClick='"+windowRef+"ColorPicker_hide("+windowRef+"window.popupWindowObjects["+cp.index+"]); chooseColor("+windowRef+"window.ColorPicker_targetInput.id,"+windowRef+"window.ColorPicker_targetButton.id);return false;'> <IMG SRC='images/custom-button.gif'/> </TD></TR>";

  cp_contents += '</TABLE>';
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



function ColorPicker_AutoHide(obj) {

  obj.okPressed = true;
  ColorPicker_canxColor = null;
}









